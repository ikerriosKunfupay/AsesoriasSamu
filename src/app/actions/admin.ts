"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import {
  archivePricingPlanSchema,
  assignmentSchema,
  clientAdminNoteSchema,
  clientCommercialTermsSchema,
  clientStatusSchema,
  dashboardGoalsSchema,
  feeSchema,
  fieldErrors,
  formValues,
  inviteSchema,
  pricingPlanSchema,
} from "@/lib/forms/schemas";
import { requireAdmin } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { billingCycleMonths } from "@/lib/admin/commercial-terms";

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
  revalidatePath("/admin");
  revalidatePath("/admin/cuotas");
  return { status: "success", message: "Cuota actualizada." };
}

export async function saveClientAdminNoteAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = clientAdminNoteSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa la nota.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("client_admin_notes").upsert(
    {
      client_id: parsed.data.clientId,
      notes: parsed.data.notes,
      updated_by: adminUser.id,
    },
    { onConflict: "client_id" },
  );

  if (error) return { status: "error", message: "No se pudo guardar la nota." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "client.note_updated",
    entity_type: "profile",
    entity_id: parsed.data.clientId,
  });
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${parsed.data.clientId}`);
  return { status: "success", message: "Nota guardada." };
}

export async function setClientStatusAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = clientStatusSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "No se pudo cambiar el estado." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ status: parsed.data.nextStatus })
    .eq("id", parsed.data.clientId)
    .eq("role", "client")
    .select("id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo cambiar el estado." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: parsed.data.nextStatus === "active" ? "client.activated" : "client.archived",
    entity_type: "profile",
    entity_id: parsed.data.clientId,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${parsed.data.clientId}`);
  return {
    status: "success",
    message: parsed.data.nextStatus === "active" ? "Cliente dado de alta." : "Cliente dado de baja.",
  };
}

export async function saveDashboardGoalsAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = dashboardGoalsSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los objetivos.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("admin_dashboard_settings").upsert(
    {
      admin_id: adminUser.id,
      monthly_revenue_goal_eur: parsed.data.monthlyRevenueGoalEur,
      active_clients_goal: parsed.data.activeClientsGoal,
    },
    { onConflict: "admin_id" },
  );

  if (error) return { status: "error", message: "No se pudieron guardar los objetivos." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "dashboard.goals_updated",
    entity_type: "admin_dashboard_settings",
    entity_id: adminUser.id,
  });
  revalidatePath("/admin");
  return { status: "success", message: "Objetivos actualizados." };
}

export async function savePricingPlanAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = pricingPlanSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos de la tarifa.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const pricingPlanId = parsed.data.pricingPlanId || null;
  const payload = {
    name: parsed.data.name,
    billing_cycle: parsed.data.billingCycle,
    duration_months: billingCycleMonths(parsed.data.billingCycle, parsed.data.durationMonths),
    default_amount_eur: parsed.data.amountEur,
  };
  const result = pricingPlanId
    ? await admin.from("pricing_plans").update(payload).eq("id", pricingPlanId).eq("active", true).select("id").maybeSingle()
    : await admin.from("pricing_plans").insert({ ...payload, created_by: adminUser.id }).select("id").single();

  if (result.error || !result.data) {
    return {
      status: "error",
      message: result.error?.code === "23505"
        ? "Ya existe una tarifa activa con ese nombre."
        : "No se pudo guardar la tarifa.",
    };
  }

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: pricingPlanId ? "pricing_plan.updated" : "pricing_plan.created",
    entity_type: "pricing_plan",
    entity_id: result.data.id,
  });
  revalidatePath("/admin/tarifas");
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  return { status: "success", message: pricingPlanId ? "Tarifa actualizada." : "Tarifa creada." };
}

export async function archivePricingPlanAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = archivePricingPlanSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: "Tarifa no válida." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("pricing_plans")
    .update({ active: false })
    .eq("id", parsed.data.pricingPlanId)
    .eq("active", true)
    .select("id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo eliminar la tarifa del selector." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "pricing_plan.archived",
    entity_type: "pricing_plan",
    entity_id: data.id,
  });
  revalidatePath("/admin/tarifas");
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  return { status: "success", message: "Tarifa eliminada del selector." };
}

export async function saveClientCommercialTermsAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = clientCommercialTermsSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa las condiciones comerciales.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  let pricingPlanId = parsed.data.pricingPlanId;

  if (pricingPlanId === "new") {
    const { data: newPlan, error: planError } = await admin
      .from("pricing_plans")
      .insert({
        name: parsed.data.newPlanName!,
        billing_cycle: parsed.data.newBillingCycle!,
        duration_months: billingCycleMonths(parsed.data.newBillingCycle!, parsed.data.newDurationMonths),
        default_amount_eur: parsed.data.amountEur,
        created_by: adminUser.id,
      })
      .select("id")
      .single();

    if (planError || !newPlan) {
      return {
        status: "error",
        message: planError?.code === "23505"
          ? "Ya existe una tarifa activa con ese nombre; selecciónala de la lista."
          : "No se pudo crear la nueva tarifa.",
      };
    }
    pricingPlanId = newPlan.id;
  }

  const { error } = await admin.from("client_commercial_terms").upsert(
    {
      client_id: parsed.data.clientId,
      modality: parsed.data.modality,
      pricing_plan_id: pricingPlanId,
      agreed_amount_eur: parsed.data.amountEur,
      updated_by: adminUser.id,
    },
    { onConflict: "client_id" },
  );

  if (error) return { status: "error", message: "No se pudieron guardar las condiciones comerciales." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "client.commercial_terms_updated",
    entity_type: "profile",
    entity_id: parsed.data.clientId,
  });
  revalidatePath("/admin/clientes");
  revalidatePath("/admin");
  revalidatePath(`/admin/clientes/${parsed.data.clientId}`);
  revalidatePath("/admin/tarifas");
  return { status: "success", message: "Condiciones comerciales guardadas." };
}
