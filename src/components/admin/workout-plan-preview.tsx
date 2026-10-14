"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { workoutPlanStats, type WorkoutPlan } from "@/lib/workouts/plan";

export function WorkoutPlanPreview({ plan }: { plan: WorkoutPlan }) {
  const [activeWeekId, setActiveWeekId] = useState(plan.weeks[0].id);
  const activeWeek = plan.weeks.find((week) => week.id === activeWeekId) ?? plan.weeks[0];
  const stats = useMemo(() => workoutPlanStats(plan), [plan]);

  return (
    <div className="min-w-0">
      <section aria-labelledby="admin-workout-summary-heading" className="border-y border-border py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 id="admin-workout-summary-heading" className="text-xl font-black">{plan.blockName}</h3>
            {plan.objective ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{plan.objective}</p> : null}
          </div>
          {plan.phase ? <Badge tone="neutral">{plan.phase}</Badge> : null}
        </div>

        <dl className="mt-5 grid grid-cols-2 border-y border-border sm:grid-cols-4">
          <PreviewMetric label="Semanas" value={stats.weeks} />
          <PreviewMetric label="Sesiones" value={stats.sessions} />
          <PreviewMetric label="Ejercicios" value={stats.exercises} />
          <PreviewMetric label="Series" value={stats.series} />
        </dl>
      </section>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Semanas del entrenamiento">
        {plan.weeks.map((week) => (
          <button
            key={week.id}
            type="button"
            role="tab"
            aria-selected={week.id === activeWeek.id}
            className={`min-h-11 shrink-0 rounded-[var(--radius-md)] px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              week.id === activeWeek.id
                ? "bg-surface-inverse text-white"
                : "border border-border-strong bg-surface hover:bg-surface-muted"
            }`}
            onClick={() => setActiveWeekId(week.id)}
          >
            Semana {week.number}
          </button>
        ))}
      </div>

      <section role="tabpanel" className="mt-3 grid gap-5">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black">{activeWeek.name || `Semana ${activeWeek.number}`}</h3>
            {activeWeek.phase ? <Badge tone="neutral">{activeWeek.phase}</Badge> : null}
          </div>
          {activeWeek.objective ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{activeWeek.objective}</p> : null}
          {(activeWeek.stepsTarget !== null || activeWeek.cardioNotes) ? (
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-y border-border py-3 text-sm">
              {activeWeek.stepsTarget !== null ? <div><dt className="inline font-bold">Pasos diarios: </dt><dd className="inline tabular-nums">{activeWeek.stepsTarget.toLocaleString("es-ES")}</dd></div> : null}
              {activeWeek.cardioNotes ? <div><dt className="inline font-bold">Cardio: </dt><dd className="inline">{activeWeek.cardioNotes}</dd></div> : null}
            </dl>
          ) : null}
        </header>

        {activeWeek.sessions.map((session) => (
          <article key={session.id} className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <header className="bg-surface-muted px-4 py-4 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Sesión {session.number}</p>
              <h4 className="mt-1 text-lg font-black">{session.name}</h4>
            </header>
            <div className="divide-y divide-border">
              {session.exercises.map((exercise, exerciseIndex) => (
                <section key={exercise.id} className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(12rem,1.4fr)_repeat(4,minmax(6rem,0.6fr))] lg:items-start">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted">{exercise.muscleGroup}</p>
                    <h5 className="mt-1 font-black">{exerciseIndex + 1}. {exercise.name}</h5>
                    {exercise.referenceUrl ? (
                      <a className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-primary hover:underline" href={exercise.referenceUrl} target="_blank" rel="noreferrer">
                        Ver técnica del ejercicio <ExternalLink aria-hidden="true" className="size-3.5" />
                      </a>
                    ) : null}
                    {exercise.method ? <p className="mt-1 text-sm text-muted">{exercise.method}</p> : null}
                    {exercise.cues ? <p className="mt-3 text-sm leading-6 text-muted">{exercise.cues}</p> : null}
                  </div>
                  <PreviewDetail label="Series" value={exercise.sets} />
                  <PreviewDetail label="Repeticiones" value={exercise.reps} />
                  <PreviewDetail label="RIR objetivo" value={exercise.targetRir.map((rir) => rir ?? "—").join(" · ")} />
                  <PreviewDetail label="Descanso" value={exercise.rest || "—"} />
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-b border-border px-3 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <dt className="text-xs font-bold text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-black tabular-nums">{value}</dd>
    </div>
  );
}

function PreviewDetail({ label, value }: { label: string; value: string | number }) {
  return (
    <dl className="min-w-0">
      <dt className="text-xs font-bold text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold tabular-nums">{value}</dd>
    </dl>
  );
}
