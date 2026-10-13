"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import { fieldErrors, formValues, leadSchema } from "@/lib/forms/schemas";
import { leadReference } from "@/lib/leads/reference";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createLeadAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = leadSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
  }

  if (Date.now() - parsed.data.startedAt < 1800) {
    return { status: "error", message: "No hemos podido validar el formulario. Inténtalo de nuevo." };
  }

  const admin = createAdminClient();
  const { data: createdLead, error } = await admin
    .from("leads")
    .insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      goal: parsed.data.goal,
      contact_preference: parsed.data.contactPreference,
    })
    .select("id")
    .single();

  if (error || !createdLead) {
    console.error("lead.create_failed", {
      code: error?.code ?? "missing_created_lead",
    });
    return { status: "error", message: "No se pudo guardar la solicitud. Prueba de nuevo en unos minutos." };
  }

  console.info("lead.created");
  revalidatePath("/admin");
  revalidatePath("/admin/interesados");

  return {
    status: "success",
    message: `Solicitud guardada. Referencia ${leadReference(createdLead.id)}. Team Ortega se pondrá en contacto contigo.`,
  };
}
