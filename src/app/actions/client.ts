"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import {
  checkInSchema,
  fieldErrors,
  formValues,
  onboardingSchema,
} from "@/lib/forms/schemas";
import { requireClient, requireCompletedClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { findWorkoutExercise, parseWorkoutPlan, type WorkoutSetLog } from "@/lib/workouts/plan";
import { z } from "zod";

const workoutLogContextSchema = z.object({
  assignmentId: z.string().uuid(),
  weekNumber: z.coerce.number().int().min(1).max(16),
  sessionNumber: z.coerce.number().int().min(1).max(8),
});

const workoutSetFieldPattern = /^set:([0-9a-f-]{36}):(\d):(?:load|reps|rir)$/i;

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

export async function saveOnboardingAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireClient();
  const parsed = onboardingSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Revisa los campos marcados.",
      messageId: crypto.randomUUID(),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error: submissionError } = await supabase.from("onboarding_submissions").upsert(
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

  if (submissionError) {
    console.error("client.onboarding_failed", {
      stage: "submission",
      code: submissionError.code,
    });
    return {
      status: "error",
      message: "No se pudo guardar el cuestionario.",
      messageId: crypto.randomUUID(),
    };
  }
  const { error: consentError } = await supabase.from("consent_acceptances").upsert(
    { user_id: user.id, consent_type: "health_data", policy_version: "2026-10-12" },
    { onConflict: "user_id,consent_type,policy_version" },
  );

  if (consentError) {
    console.error("client.onboarding_failed", {
      stage: "consent",
      code: consentError.code,
    });
    return {
      status: "error",
      message: "El cuestionario se guardó, pero no pudimos registrar el consentimiento. Inténtalo de nuevo.",
      messageId: crypto.randomUUID(),
    };
  }

  const { error: completionError } = await supabase.rpc("complete_onboarding");
  if (completionError) {
    console.error("client.onboarding_failed", {
      stage: "completion",
      code: completionError.code,
    });
    return {
      status: "error",
      message: "El cuestionario se guardó, pero no pudimos activar el perfil. Inténtalo de nuevo.",
      messageId: crypto.randomUUID(),
    };
  }

  console.info("client.onboarding_saved");
  revalidatePath("/app", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
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

export async function saveWorkoutSetLogsAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireCompletedClient();
  const context = workoutLogContextSchema.safeParse(formValues(formData));
  if (!context.success) return { status: "error", message: "No se pudo identificar la sesión." };

  const supabase = await createClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("workout_assignments")
    .select("id, plan_data")
    .eq("id", context.data.assignmentId)
    .eq("client_id", user.id)
    .eq("status", "published")
    .maybeSingle();
  const plan = parseWorkoutPlan(assignment?.plan_data);
  if (assignmentError || !assignment || !plan) {
    return { status: "error", message: "El entrenamiento ya no está disponible." };
  }

  const week = plan.weeks.find((candidate) => candidate.number === context.data.weekNumber);
  const session = week?.sessions.find((candidate) => candidate.number === context.data.sessionNumber);
  if (!week || !session) return { status: "error", message: "La sesión no pertenece a este entrenamiento." };

  const { data: existingLogs, error: existingLogsError } = await supabase
    .from("workout_set_logs")
    .select("exercise_id, set_number")
    .eq("client_id", user.id)
    .eq("assignment_id", assignment.id)
    .eq("week_number", week.number)
    .eq("session_number", session.number);
  if (existingLogsError) return { status: "error", message: "No se pudieron consultar los resultados actuales." };

  const seenFields = [...formData.keys()].filter((key) => workoutSetFieldPattern.test(key));
  if (seenFields.length > 300) return { status: "error", message: "La sesión contiene demasiados datos." };

  const entries: WorkoutSetLog[] = [];
  for (const exercise of session.exercises) {
    const located = findWorkoutExercise(plan, exercise.id);
    if (!located || located.week.number !== week.number || located.session.number !== session.number) {
      return { status: "error", message: "El ejercicio no pertenece a esta sesión." };
    }
    for (let index = 0; index < exercise.sets; index += 1) {
      const setNumber = index + 1;
      const loadKg = parseOptionalNumber(formData.get(`set:${exercise.id}:${setNumber}:load`));
      const reps = parseOptionalNumber(formData.get(`set:${exercise.id}:${setNumber}:reps`));
      const rir = parseOptionalNumber(formData.get(`set:${exercise.id}:${setNumber}:rir`));
      if (
        Number.isNaN(loadKg) || Number.isNaN(reps) || Number.isNaN(rir)
        || (loadKg !== null && (loadKg < 0 || loadKg > 1000))
        || (reps !== null && (!Number.isInteger(reps) || reps < 0 || reps > 500))
        || (rir !== null && (rir < 0 || rir > 10))
      ) {
        return { status: "error", message: "Revisa las cargas, repeticiones y RIR introducidos." };
      }
      entries.push({
        exerciseId: exercise.id,
        weekNumber: week.number,
        sessionNumber: session.number,
        setNumber,
        loadKg,
        reps,
        rir,
      });
    }
  }

  const completedEntries = entries.filter((entry) => entry.loadKg !== null || entry.reps !== null || entry.rir !== null);
  if (completedEntries.length) {
    const { error: upsertError } = await supabase.from("workout_set_logs").upsert(
      completedEntries.map((entry) => ({
        client_id: user.id,
        assignment_id: assignment.id,
        exercise_id: entry.exerciseId,
        week_number: entry.weekNumber,
        session_number: entry.sessionNumber,
        set_number: entry.setNumber,
        load_kg: entry.loadKg,
        reps: entry.reps,
        rir: entry.rir,
      })),
      { onConflict: "client_id,assignment_id,exercise_id,set_number" },
    );
    if (upsertError) return { status: "error", message: "No se pudieron guardar los resultados." };
  }

  const existingKeys = new Set((existingLogs ?? []).map((log) => `${log.exercise_id}:${log.set_number}`));
  const clearedEntries = entries.filter((entry) => (
    entry.loadKg === null
    && entry.reps === null
    && entry.rir === null
    && existingKeys.has(`${entry.exerciseId}:${entry.setNumber}`)
  ));
  const deleteResults = await Promise.all(clearedEntries.map((entry) => supabase
    .from("workout_set_logs")
    .delete()
    .eq("client_id", user.id)
    .eq("assignment_id", assignment.id)
    .eq("exercise_id", entry.exerciseId)
    .eq("set_number", entry.setNumber)));
  if (deleteResults.some((result) => result.error)) {
    return { status: "error", message: "Los resultados se guardaron, pero algún campo vacío no se pudo limpiar." };
  }

  revalidatePath("/app/entrenamiento");
  return { status: "success", message: "Resultados de la sesión guardados." };
}
