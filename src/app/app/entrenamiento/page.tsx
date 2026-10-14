import { Dumbbell } from "lucide-react";
import { PlanView } from "@/components/client/plan-view";
import { WorkoutPlanView } from "@/components/client/workout-plan-view";
import { PageHeading } from "@/components/layout/page-heading";
import { requireCompletedClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { parseWorkoutPlan } from "@/lib/workouts/plan";

export default async function ClientWorkoutPage() {
  const user = await requireCompletedClient();
  const supabase = await createClient();
  const { data } = await supabase.from("workout_assignments").select("id, title, content, plan_data, starts_on, updated_at").eq("client_id", user.id).eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle();
  const plan = parseWorkoutPlan(data?.plan_data);
  const { data: setLogs } = data && plan
    ? await supabase.from("workout_set_logs").select("exercise_id, week_number, session_number, set_number, load_kg, reps, rir").eq("assignment_id", data.id).eq("client_id", user.id)
    : { data: [] };

  return <>
    <PageHeading eyebrow="Mi plan" title="Entrenamiento" description="Consulta tu planificación y registra lo que completas en cada serie." />
    {data && plan ? (
      <WorkoutPlanView
        assignment={{ id: data.id, title: data.title, startsOn: data.starts_on, updatedAt: data.updated_at, plan }}
        logs={(setLogs ?? []).map((log) => ({
          exerciseId: log.exercise_id,
          weekNumber: log.week_number,
          sessionNumber: log.session_number,
          setNumber: log.set_number,
          loadKg: log.load_kg,
          reps: log.reps,
          rir: log.rir,
        }))}
      />
    ) : (
      <PlanView plan={data} icon={Dumbbell} emptyTitle="Aún no hay entrenamiento publicado" emptyDescription="Tu entrenador está preparando el plan. Aparecerá aquí cuando esté listo." />
    )}
  </>;
}
