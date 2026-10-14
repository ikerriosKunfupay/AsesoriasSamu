"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import {
  archivePricingPlanSchema,
  assignmentDeleteSchema,
  assignmentSchema,
  assignmentTemplateDeleteSchema,
  assignmentTemplateUpdateSchema,
  assignmentUpdateSchema,
  clientAdminNoteSchema,
  clientCommercialTermsSchema,
  clientCommercialQuickUpdateSchema,
  clientStatusSchema,
  dashboardGoalsSchema,
  feeDeleteSchema,
  feeNoteSchema,
  feeSchema,
  feeUpdateSchema,
  fieldErrors,
  formValues,
  inviteSchema,
  pricingPlanSchema,
  structuredWorkoutAssignmentSchema,
  structuredWorkoutUpdateSchema,
} from "@/lib/forms/schemas";
import { requireAdmin } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { billingCycleMonths } from "@/lib/admin/commercial-terms";
import type { Json } from "@/lib/supabase/database.types";
import {
  parseWorkoutPlan,
  workoutPlanFallbackContent,
  workoutPlanStats,
} from "@/lib/workouts/plan";

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
  if (parsed.data.saveAsTemplate) {
    const { error: templateError } = await admin.from("assignment_templates").upsert({
      kind: parsed.data.kind,
      name: parsed.data.title,
      title: parsed.data.title,
      content: parsed.data.content,
      created_by: adminUser.id,
    }, { onConflict: "created_by,kind,name" });
    if (templateError) return { status: "error", message: "No se pudo guardar la plantilla." };
  }
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
  revalidatePath(parsed.data.kind === "workout" ? "/admin/entrenamientos" : "/admin/nutricion");
  revalidatePath(parsed.data.kind === "workout" ? "/app/entrenamiento" : "/app/nutricion");
  return { status: "success", message: "Plan guardado correctamente." };
}

export async function saveWorkoutPlanAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = structuredWorkoutAssignmentSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos generales del entrenamiento.", fieldErrors: fieldErrors(parsed.error) };
  }

  const plan = parseWorkoutPlan(parsed.data.planData);
  if (!plan) {
    return {
      status: "error",
      message: "Revisa las semanas, sesiones y ejercicios del entrenamiento.",
      fieldErrors: { planData: ["El plan contiene datos incompletos o no válidos."] },
    };
  }

  const admin = createAdminClient();
  const { data: client } = await admin
    .from("profiles")
    .select("id")
    .eq("id", parsed.data.clientId)
    .eq("role", "client")
    .maybeSingle();
  if (!client) return { status: "error", message: "El cliente seleccionado no es válido." };

  const { data: assignment, error } = await admin
    .from("workout_assignments")
    .insert({
      client_id: client.id,
      title: parsed.data.title,
      content: workoutPlanFallbackContent(plan),
      plan_data: JSON.parse(JSON.stringify(plan)) as Json,
      starts_on: parsed.data.startsOn || null,
      status: parsed.data.status,
      created_by: adminUser.id,
    })
    .select("id")
    .single();

  if (error || !assignment) return { status: "error", message: "No se pudo guardar el entrenamiento." };

  const stats = workoutPlanStats(plan);
  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "workout.created",
    entity_type: "workout_assignments",
    entity_id: assignment.id,
    metadata: {
      client_id: client.id,
      status: parsed.data.status,
      weeks: stats.weeks,
      sessions: stats.sessions,
      exercises: stats.exercises,
    },
  });
  revalidatePath(`/admin/clientes/${client.id}`);
  revalidatePath("/admin/entrenamientos");
  revalidatePath("/app/entrenamiento");
  return { status: "success", message: "Entrenamiento guardado correctamente." };
}

export async function updateWorkoutPlanAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = structuredWorkoutUpdateSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos generales del entrenamiento.", fieldErrors: fieldErrors(parsed.error) };
  }

  const plan = parseWorkoutPlan(parsed.data.planData);
  if (!plan) {
    return {
      status: "error",
      message: "Revisa las semanas, sesiones y ejercicios del entrenamiento.",
      fieldErrors: { planData: ["El plan contiene datos incompletos o no válidos."] },
    };
  }

  const admin = createAdminClient();
  const [{ data: client }, { data: previous }] = await Promise.all([
    admin.from("profiles").select("id").eq("id", parsed.data.clientId).eq("role", "client").maybeSingle(),
    admin.from("workout_assignments").select("id, client_id").eq("id", parsed.data.assignmentId).maybeSingle(),
  ]);
  if (!client) return { status: "error", message: "El cliente seleccionado no es válido." };
  if (!previous) return { status: "error", message: "El entrenamiento ya no existe." };

  const { data: assignment, error } = await admin
    .from("workout_assignments")
    .update({
      client_id: client.id,
      title: parsed.data.title,
      content: workoutPlanFallbackContent(plan),
      plan_data: JSON.parse(JSON.stringify(plan)) as Json,
      starts_on: parsed.data.startsOn || null,
      status: parsed.data.status,
    })
    .eq("id", previous.id)
    .select("id")
    .maybeSingle();

  if (error || !assignment) return { status: "error", message: "No se pudo actualizar el entrenamiento." };

  const stats = workoutPlanStats(plan);
  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "workout.updated",
    entity_type: "workout_assignments",
    entity_id: assignment.id,
    metadata: {
      client_id: client.id,
      status: parsed.data.status,
      weeks: stats.weeks,
      sessions: stats.sessions,
      exercises: stats.exercises,
    },
  });
  revalidatePath(`/admin/clientes/${previous.client_id}`);
  revalidatePath(`/admin/clientes/${client.id}`);
  revalidatePath("/admin/entrenamientos");
  revalidatePath("/app/entrenamiento");
  return { status: "success", message: "Entrenamiento actualizado correctamente." };
}

export async function updateAssignmentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = assignmentUpdateSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa el plan.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const table = parsed.data.kind === "workout" ? "workout_assignments" : "nutrition_assignments";
  if (parsed.data.saveAsTemplate) {
    const { error: templateError } = await admin.from("assignment_templates").upsert({
      kind: parsed.data.kind,
      name: parsed.data.title,
      title: parsed.data.title,
      content: parsed.data.content,
      created_by: adminUser.id,
    }, { onConflict: "created_by,kind,name" });
    if (templateError) return { status: "error", message: "No se pudo guardar la plantilla." };
  }
  const { data: previous } = await admin
    .from(table)
    .select("client_id")
    .eq("id", parsed.data.assignmentId)
    .maybeSingle();
  const { data, error } = await admin
    .from(table)
    .update({
      client_id: parsed.data.clientId,
      title: parsed.data.title,
      content: parsed.data.content,
      starts_on: parsed.data.startsOn || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.assignmentId)
    .select("id, client_id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo actualizar el plan." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: `${parsed.data.kind}.updated`,
    entity_type: table,
    entity_id: data.id,
    metadata: { client_id: data.client_id, status: parsed.data.status },
  });
  if (previous?.client_id) revalidatePath(`/admin/clientes/${previous.client_id}`);
  revalidatePath(`/admin/clientes/${data.client_id}`);
  revalidatePath(parsed.data.kind === "workout" ? "/admin/entrenamientos" : "/admin/nutricion");
  revalidatePath(parsed.data.kind === "workout" ? "/app/entrenamiento" : "/app/nutricion");
  return { status: "success", message: "Plan actualizado correctamente." };
}

export async function deleteAssignmentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = assignmentDeleteSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: "Plan no válido." };

  const admin = createAdminClient();
  const table = parsed.data.kind === "workout" ? "workout_assignments" : "nutrition_assignments";
  const { data, error } = await admin
    .from(table)
    .delete()
    .eq("id", parsed.data.assignmentId)
    .select("id, client_id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo eliminar el plan." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: `${parsed.data.kind}.deleted`,
    entity_type: table,
    entity_id: data.id,
    metadata: { client_id: data.client_id },
  });
  revalidatePath(`/admin/clientes/${data.client_id}`);
  revalidatePath(parsed.data.kind === "workout" ? "/admin/entrenamientos" : "/admin/nutricion");
  revalidatePath(parsed.data.kind === "workout" ? "/app/entrenamiento" : "/app/nutricion");
  return { status: "success", message: "Plan eliminado." };
}

export async function updateAssignmentTemplateAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = assignmentTemplateUpdateSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa la plantilla.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("assignment_templates")
    .update({
      name: parsed.data.name,
      title: parsed.data.title,
      content: parsed.data.content,
    })
    .eq("id", parsed.data.templateId)
    .eq("kind", parsed.data.kind)
    .eq("created_by", adminUser.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      status: "error",
      message: error?.code === "23505"
        ? "Ya existe una plantilla con ese nombre."
        : "No se pudo actualizar la plantilla.",
    };
  }

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "assignment_template.updated",
    entity_type: "assignment_templates",
    entity_id: data.id,
    metadata: { kind: parsed.data.kind },
  });
  revalidatePath(parsed.data.kind === "workout" ? "/admin/entrenamientos" : "/admin/nutricion");
  return { status: "success", message: "Plantilla actualizada." };
}

export async function deleteAssignmentTemplateAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = assignmentTemplateDeleteSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: "Plantilla no válida." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("assignment_templates")
    .delete()
    .eq("id", parsed.data.templateId)
    .eq("kind", parsed.data.kind)
    .eq("created_by", adminUser.id)
    .select("id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo eliminar la plantilla." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "assignment_template.deleted",
    entity_type: "assignment_templates",
    entity_id: data.id,
    metadata: { kind: parsed.data.kind },
  });
  revalidatePath(parsed.data.kind === "workout" ? "/admin/entrenamientos" : "/admin/nutricion");
  return { status: "success", message: "Plantilla eliminada." };
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

export async function updateFeeAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = feeUpdateSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa la cuota.", fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("manual_fee_records")
    .update({
      client_id: parsed.data.clientId,
      period: parsed.data.period,
      amount_eur: parsed.data.amountEur,
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      recorded_by: adminUser.id,
    })
    .eq("id", parsed.data.feeId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      status: "error",
      message: error?.code === "23505"
        ? "Ya existe una cuota de ese cliente para el periodo elegido."
        : "No se pudo actualizar la cuota.",
    };
  }

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "fee.updated",
    entity_type: "manual_fee_record",
    entity_id: data.id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/cuotas");
  return { status: "success", message: "Cuota actualizada." };
}

export async function deleteFeeAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = feeDeleteSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: "Cuota no válida." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("manual_fee_records")
    .delete()
    .eq("id", parsed.data.feeId)
    .select("id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo eliminar la cuota." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "fee.deleted",
    entity_type: "manual_fee_record",
    entity_id: data.id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/cuotas");
  return { status: "success", message: "Cuota eliminada." };
}

export async function saveFeeNoteAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = feeNoteSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: "Revisa la nota.", fieldErrors: fieldErrors(parsed.error) };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("manual_fee_records")
    .update({ notes: parsed.data.notes || null, recorded_by: adminUser.id })
    .eq("id", parsed.data.feeId)
    .select("id")
    .maybeSingle();

  if (error || !data) return { status: "error", message: "No se pudo guardar la nota." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "fee.note_updated",
    entity_type: "manual_fee_record",
    entity_id: data.id,
  });
  revalidatePath("/admin/cuotas");
  return { status: "success", message: "Nota guardada." };
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
    service_modality: parsed.data.serviceModality,
    days_per_week: parsed.data.daysPerWeek,
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
        ? "Ya existe una tarifa activa con esa modalidad, periodicidad y días."
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
        service_modality: parsed.data.modality,
        days_per_week: parsed.data.newPlanDaysPerWeek,
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
          ? "Ya existe una tarifa activa con esos mismos datos; selecciónala de la lista."
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

export async function saveClientCommercialQuickUpdateAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = clientCommercialQuickUpdateSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "No se pudo actualizar este campo." };
  }

  const admin = createAdminClient();
  const { data: currentTerms, error: currentError } = await admin
    .from("client_commercial_terms")
    .select("modality, pricing_plan_id, agreed_amount_eur")
    .eq("client_id", parsed.data.clientId)
    .maybeSingle();

  if (currentError) return { status: "error", message: "No se pudieron leer las condiciones actuales." };

  let modality = currentTerms?.modality ?? "in_person";
  let pricingPlanId = currentTerms?.pricing_plan_id ?? null;
  let amountEur = currentTerms?.agreed_amount_eur ?? 0;

  if (parsed.data.field === "modality") {
    modality = parsed.data.value;
  } else {
    pricingPlanId = parsed.data.value || null;
    if (pricingPlanId) {
      const { data: plan, error: planError } = await admin
        .from("pricing_plans")
        .select("default_amount_eur, service_modality")
        .eq("id", pricingPlanId)
        .maybeSingle();
      if (planError || !plan) return { status: "error", message: "La tarifa seleccionada ya no está disponible." };
      amountEur = plan.default_amount_eur;
      if (plan.service_modality) modality = plan.service_modality;
    }
  }

  const { error } = await admin.from("client_commercial_terms").upsert(
    {
      client_id: parsed.data.clientId,
      modality,
      pricing_plan_id: pricingPlanId,
      agreed_amount_eur: amountEur,
      updated_by: adminUser.id,
    },
    { onConflict: "client_id" },
  );

  if (error) return { status: "error", message: "No se pudo actualizar este campo." };

  await admin.from("audit_events").insert({
    actor_id: adminUser.id,
    action: "client.commercial_terms_quick_updated",
    entity_type: "profile",
    entity_id: parsed.data.clientId,
    metadata: { field: parsed.data.field },
  });
  revalidatePath("/admin/clientes");
  revalidatePath("/admin");
  revalidatePath(`/admin/clientes/${parsed.data.clientId}`);
  return {
    status: "success",
    message: parsed.data.field === "modality" ? "Modalidad actualizada." : "Tarifa actualizada.",
  };
}
