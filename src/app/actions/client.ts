"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import {
  checkInSchema,
  fieldErrors,
  formValues,
  onboardingSchema,
} from "@/lib/forms/schemas";
import { requireClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireClient();
  const parsed = onboardingSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      messageId: crypto.randomUUID(),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("onboarding_submissions").upsert(
    {
      user_id: user.id,
      age: parsed.data.age,
      sex: parsed.data.sex,
      weight_kg: parsed.data.weightKg,
      height_cm: parsed.data.heightCm,
      occupation_schedule: parsed.data.occupationSchedule,
      training_priority: parsed.data.trainingPriority,
      meal_availability: parsed.data.mealAvailability,
      conditions_injuries: parsed.data.conditionsInjuries || null,
      allergies_intolerances: parsed.data.allergiesIntolerances || null,
      goals: parsed.data.goals,
      social_networks: parsed.data.socialNetworks || null,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return {
      status: "error",
      message: "No se pudo guardar el cuestionario.",
      messageId: crypto.randomUUID(),
    };
  }
  await supabase.from("consent_acceptances").upsert(
    { user_id: user.id, consent_type: "health_data", policy_version: "2026-10-12" },
    { onConflict: "user_id,consent_type,policy_version" },
  );
  await supabase.rpc("complete_onboarding");
  revalidatePath("/app", "layout");
  return { status: "success", message: "Cuestionario guardado. Ya puedes consultar tu área personal." };
}

export async function createCheckInAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireClient();
  const parsed = checkInSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa el seguimiento.", fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("check_ins").insert({
    client_id: user.id,
    weight_kg: parsed.data.weightKg === "" ? null : parsed.data.weightKg,
    energy_level: parsed.data.energyLevel,
    adherence_level: parsed.data.adherenceLevel,
    notes: parsed.data.notes || null,
  });

  if (error) return { status: "error", message: "No se pudo guardar el seguimiento." };
  revalidatePath("/app/seguimiento");
  return { status: "success", message: "Seguimiento enviado a tu entrenador." };
}
