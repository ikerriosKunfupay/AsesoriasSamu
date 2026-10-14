import { AssignmentsManager } from "@/components/admin/assignments-manager";
import { PageHeading } from "@/components/layout/page-heading";
import { ButtonLink } from "@/components/ui/button";
import { Library } from "lucide-react";
import { requireAdmin } from "@/lib/auth/current-user";
import type { AdminAssignment, AssignmentTemplate } from "@/lib/admin/assignments";
import type { ExerciseCatalogItem } from "@/lib/admin/exercise-catalog";
import { createAdminClient } from "@/lib/supabase/admin";
import { createBlankWorkoutPlan, parseWorkoutPlan } from "@/lib/workouts/plan";

export default async function WorkoutsPage() {
  const currentAdmin = await requireAdmin();
  const supabase = createAdminClient();
  const [{ data: plans }, { data: profiles }, { data: templates }, { data: catalog }] = await Promise.all([
    supabase
      .from("workout_assignments")
      .select("id, client_id, title, content, status, starts_on, created_at, plan_data")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, status").eq("role", "client").order("full_name"),
    supabase.from("assignment_templates").select("id, name, title, content").eq("created_by", currentAdmin.id).eq("kind", "workout").order("name"),
    supabase
      .from("exercise_catalog")
      .select("id, muscle_group, name, reference_url, cues, muscle_order, source_order")
      .order("muscle_order")
      .order("source_order")
      .order("name"),
  ]);
  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name || "Cliente sin nombre"]));
  const clients = (profiles ?? [])
    .filter((profile) => profile.status === "active")
    .map((profile) => ({ id: profile.id, full_name: profile.full_name || "Cliente sin nombre" }));
  const assignments: AdminAssignment[] = (plans ?? []).map((plan) => ({
    id: plan.id,
    clientId: plan.client_id,
    clientName: names.get(plan.client_id) ?? "Cliente",
    title: plan.title,
    content: plan.content,
    status: plan.status as AdminAssignment["status"],
    startsOn: plan.starts_on,
    createdAt: plan.created_at,
    planData: parseWorkoutPlan(plan.plan_data),
  }));
  const assignmentTemplates = (templates ?? []) as AssignmentTemplate[];
  const exerciseCatalog: ExerciseCatalogItem[] = (catalog ?? []).map((item) => ({
    id: item.id,
    muscleGroup: item.muscle_group,
    name: item.name,
    referenceUrl: item.reference_url ?? "",
    cues: item.cues,
    muscleOrder: item.muscle_order,
    sourceOrder: item.source_order,
  }));

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
      <PageHeading
        eyebrow="Asesorías"
        title="Entrenamientos"
        description="Consulta el histórico y crea nuevos entrenamientos desde esta misma sección."
        action={(
          <ButtonLink href="/admin/entrenamientos/ejercicios" variant="outline">
            <Library aria-hidden="true" className="size-4" />
            Biblioteca de ejercicios
          </ButtonLink>
        )}
      />
      <AssignmentsManager
        kind="workout"
        clients={clients}
        assignments={assignments}
        templates={assignmentTemplates}
        workoutInitialPlan={createBlankWorkoutPlan()}
        exerciseCatalog={exerciseCatalog}
      />
    </div>
  );
}
