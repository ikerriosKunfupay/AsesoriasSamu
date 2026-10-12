"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import {
  assignmentSchema,
  feeSchema,
  fieldErrors,
  formValues,
  inviteSchema,
} from "@/lib/forms/schemas";
import { requireAdmin } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/admin";

export async function inviteClientAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = inviteSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const email = parsed.data.email.toLowerCase();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/actualizar-contrasena`,
    data: { full_name: parsed.data.fullName },
  });

  if (error || !data.user) {
    return { status: "error", message: error?.message.includes("already") ? "Ya existe una cuenta con ese correo." : "No se pudo enviar la invitación." };
  }

  await admin.from("profiles").update({ full_name: parsed.data.fullName, status: "invited" }).eq("id", data.user.id);
  await admin.from("client_invitations").insert({
    email,
    full_name: parsed.data.fullName,
    invited_by: adminUser.id,
  });
  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "client.invited",
    entity_type: "profile",
    entity_id: data.user.id,
    metadata: { email },
  });

  revalidatePath("/admin/clientes");
  return { status: "success", message: "Invitación enviada correctamente." };
}

export async function saveAssignmentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = assignmentSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa el plan.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const table = parsed.data.kind === "workout" ? "workout_assignments" : "nutrition_assignments";
  const { error } = await admin.from(table).insert({
    client_id: parsed.data.clientId,
    title: parsed.data.title,
    content: parsed.data.content,
    starts_on: parsed.data.startsOn || null,
    status: parsed.data.status,
    created_by: adminUser.id,
  });

  if (error) return { status: "error", message: "No se pudo guardar el plan." };
  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: `${parsed.data.kind}.created`,
    entity_type: table,
    metadata: { client_id: parsed.data.clientId, status: parsed.data.status },
  });
  revalidatePath(`/admin/clientes/${parsed.data.clientId}`);
  revalidatePath(parsed.data.kind === "workout" ? "/app/entrenamiento" : "/app/nutricion");
  return { status: "success", message: "Plan guardado correctamente." };
}

export async function saveFeeAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = feeSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa la cuota.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("manual_fee_records").upsert(
    {
      client_id: parsed.data.clientId,
      period: parsed.data.period,
      amount_eur: parsed.data.amountEur,
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      recorded_by: adminUser.id,
    },
    { onConflict: "client_id,period" },
  );

  if (error) return { status: "error", message: "No se pudo guardar la cuota." };
  revalidatePath("/admin/cuotas");
  return { status: "success", message: "Cuota actualizada." };
}
