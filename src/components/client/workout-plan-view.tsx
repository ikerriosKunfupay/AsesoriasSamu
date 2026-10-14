"use client";

import { useActionState, useMemo, useState } from "react";
import { CalendarDays, Save } from "lucide-react";
import { saveWorkoutSetLogsAction } from "@/app/actions/client";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { initialActionState } from "@/lib/forms/action-state";
import {
  workoutPlanStats,
  type WorkoutPlan,
  type WorkoutSession,
  type WorkoutSetLog,
  type WorkoutWeek,
} from "@/lib/workouts/plan";

type WorkoutAssignmentView = {
  id: string;
  title: string;
  startsOn: string | null;
  updatedAt: string;
  plan: WorkoutPlan;
};

export function WorkoutPlanView({
  assignment,
  logs,
}: {
  assignment: WorkoutAssignmentView;
  logs: WorkoutSetLog[];
}) {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const stats = useMemo(() => workoutPlanStats(assignment.plan), [assignment.plan]);
  const loggedSets = logs.filter((log) => log.loadKg !== null || log.reps !== null || log.rir !== null).length;
  const loggedVolume = logs.reduce((total, log) => total + ((log.loadKg ?? 0) * (log.reps ?? 0)), 0);
  const rirLogs = logs.filter((log) => log.rir !== null);
  const averageLoggedRir = rirLogs.length
    ? rirLogs.reduce((total, log) => total + (log.rir ?? 0), 0) / rirLogs.length
    : null;
  const activeWeek = assignment.plan.weeks.find((week) => week.id === activeTab);

  return (
    <Card className="min-w-0 max-w-full overflow-hidden p-0">
      <header className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <h2 className="text-2xl font-black text-balance">{assignment.title}</h2>
          <p className="mt-1 text-sm text-muted">{assignment.plan.blockName}</p>
        </div>
        <p className="flex shrink-0 items-center gap-2 text-sm text-muted">
          <CalendarDays aria-hidden="true" className="size-4" />
          Desde {formatDate(assignment.startsOn ?? assignment.updatedAt)}
        </p>
      </header>

      <div className="border-b border-border px-4 pt-3 sm:px-6">
        <div className="flex gap-1 overflow-x-auto pb-3" role="tablist" aria-label="Vista del entrenamiento">
          <WorkoutTab active={activeTab === "summary"} onClick={() => setActiveTab("summary")}>Resumen</WorkoutTab>
          {assignment.plan.weeks.map((week) => (
            <WorkoutTab key={week.id} active={activeTab === week.id} onClick={() => setActiveTab(week.id)}>
              Semana {week.number}
            </WorkoutTab>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6" role="tabpanel">
        {activeWeek ? (
          <WeekView assignmentId={assignment.id} week={activeWeek} logs={logs} />
        ) : (
          <WorkoutSummary
            plan={assignment.plan}
            stats={stats}
            loggedSets={loggedSets}
            loggedVolume={loggedVolume}
            averageLoggedRir={averageLoggedRir}
          />
        )}
      </div>

      <p className="border-t border-border px-5 py-4 text-xs leading-5 text-muted sm:px-6">
        Si un ejercicio o indicación no te sienta bien, detente y consulta con tu entrenador. Esta planificación no sustituye atención sanitaria.
      </p>
    </Card>
  );
}

function WorkoutTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`min-h-11 shrink-0 rounded-[var(--radius-md)] px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active ? "bg-surface-inverse text-white" : "text-muted hover:bg-surface-muted hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function WorkoutSummary({
  plan,
  stats,
  loggedSets,
  loggedVolume,
  averageLoggedRir,
}: {
  plan: WorkoutPlan;
  stats: ReturnType<typeof workoutPlanStats>;
  loggedSets: number;
  loggedVolume: number;
  averageLoggedRir: number | null;
}) {
  return (
    <div className="grid gap-7">
      <section aria-labelledby="block-summary-heading">
        <h3 id="block-summary-heading" className="text-xl font-black">Resumen del bloque</h3>
        {plan.objective ? <p className="mt-2 max-w-3xl text-[15px] leading-7 text-muted">{plan.objective}</p> : null}
        {plan.phase ? <p className="mt-3 text-sm"><span className="font-bold">Fase:</span> {plan.phase}</p> : null}
        <dl className="mt-5 grid grid-cols-2 border-y border-border md:grid-cols-4 xl:grid-cols-8">
          <SummaryMetric label="Semanas" value={stats.weeks} />
          <SummaryMetric label="Sesiones" value={stats.sessions} />
          <SummaryMetric label="Ejercicios" value={stats.exercises} />
          <SummaryMetric label="Series planificadas" value={stats.series} />
          <SummaryMetric label="RIR objetivo medio" value={stats.averageTargetRir?.toLocaleString("es-ES", { maximumFractionDigits: 1 }) ?? "—"} />
          <SummaryMetric label="Series registradas" value={loggedSets} />
          <SummaryMetric label="RIR real medio" value={averageLoggedRir?.toLocaleString("es-ES", { maximumFractionDigits: 1 }) ?? "—"} />
          <SummaryMetric label="Volumen registrado" value={`${Math.round(loggedVolume).toLocaleString("es-ES")} kg`} />
        </dl>
      </section>

      <section aria-labelledby="muscle-summary-heading">
        <h3 id="muscle-summary-heading" className="text-lg font-black">Distribución de series</h3>
        {stats.seriesByMuscle.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="data-table min-w-[28rem]">
              <thead><tr><th>Grupo muscular</th><th>Series</th><th>Porcentaje</th></tr></thead>
              <tbody>
                {stats.seriesByMuscle.map((item) => (
                  <tr key={item.muscleGroup}>
                    <td className="font-bold">{item.muscleGroup}</td>
                    <td className="tabular-nums">{item.series}</td>
                    <td className="tabular-nums">{item.percentage.toLocaleString("es-ES", { maximumFractionDigits: 1 })} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="mt-2 text-sm text-muted">La distribución aparecerá cuando el plan tenga ejercicios.</p>}
      </section>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-b border-border px-3 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <dt className="text-xs font-bold text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-black tabular-nums">{value}</dd>
    </div>
  );
}

function WeekView({ assignmentId, week, logs }: { assignmentId: string; week: WorkoutWeek; logs: WorkoutSetLog[] }) {
  return (
    <div className="grid gap-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black">{week.name || `Semana ${week.number}`}</h3>
          {week.phase ? <Badge tone="neutral">{week.phase}</Badge> : null}
        </div>
        {week.objective ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{week.objective}</p> : null}
        {(week.stepsTarget !== null || week.cardioNotes) ? (
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-y border-border py-3 text-sm">
            {week.stepsTarget !== null ? <div><dt className="inline font-bold">Pasos diarios: </dt><dd className="inline tabular-nums">{week.stepsTarget.toLocaleString("es-ES")}</dd></div> : null}
            {week.cardioNotes ? <div><dt className="inline font-bold">Cardio: </dt><dd className="inline">{week.cardioNotes}</dd></div> : null}
          </dl>
        ) : null}
      </header>

      {week.sessions.map((session) => (
        <WorkoutSessionForm
          key={session.id}
          assignmentId={assignmentId}
          week={week}
          session={session}
          logs={logs.filter((log) => log.weekNumber === week.number && log.sessionNumber === session.number)}
        />
      ))}
    </div>
  );
}

function WorkoutSessionForm({
  assignmentId,
  week,
  session,
  logs,
}: {
  assignmentId: string;
  week: WorkoutWeek;
  session: WorkoutSession;
  logs: WorkoutSetLog[];
}) {
  const [state, action] = useActionState(saveWorkoutSetLogsAction, initialActionState);
  const logBySet = new Map(logs.map((log) => [`${log.exerciseId}:${log.setNumber}`, log]));

  return (
    <form action={action} className="min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-border">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <input type="hidden" name="weekNumber" value={week.number} />
      <input type="hidden" name="sessionNumber" value={session.number} />
      <div className="flex flex-col gap-2 bg-surface-muted px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Sesión {session.number}</p>
          <h4 className="mt-1 text-lg font-black">{session.name}</h4>
        </div>
        <p className="text-xs text-muted">Completa tus datos reales al terminar cada serie.</p>
      </div>

      <div className="divide-y divide-border">
        {session.exercises.map((exercise, exerciseIndex) => (
          <section key={exercise.id} className="p-4 sm:p-5" aria-labelledby={`exercise-heading-${exercise.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-muted">{exercise.muscleGroup}</p>
                <h5 id={`exercise-heading-${exercise.id}`} className="mt-1 font-black">
                  {exerciseIndex + 1}. {exercise.name}
                </h5>
              </div>
              {exercise.method ? <Badge tone="neutral">{exercise.method}</Badge> : null}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-4">
              <div><dt className="font-bold text-muted">Series</dt><dd className="mt-0.5 tabular-nums">{exercise.sets}</dd></div>
              <div><dt className="font-bold text-muted">Repeticiones</dt><dd className="mt-0.5 tabular-nums">{exercise.reps}</dd></div>
              <div><dt className="font-bold text-muted">RIR objetivo</dt><dd className="mt-0.5 tabular-nums">{exercise.targetRir.map((rir) => rir ?? "—").join(" · ")}</dd></div>
              <div><dt className="font-bold text-muted">Descanso</dt><dd className="mt-0.5">{exercise.rest || "—"}</dd></div>
            </dl>
            {exercise.cues ? <p className="mt-4 rounded-[var(--radius-md)] bg-surface-muted p-3 text-sm leading-6">{exercise.cues}</p> : null}

            <div className="mt-4 grid gap-2">
              <div className="grid grid-cols-[2.5rem_repeat(3,minmax(0,1fr))] gap-2 px-1 text-center text-[11px] font-bold text-muted" aria-hidden="true">
                <span>Serie</span><span>Carga</span><span>Reps</span><span>RIR</span>
              </div>
              {Array.from({ length: exercise.sets }, (_, setIndex) => {
                const setNumber = setIndex + 1;
                const log = logBySet.get(`${exercise.id}:${setNumber}`);
                return (
                  <div key={setNumber} className="grid grid-cols-[2.5rem_repeat(3,minmax(0,1fr))] items-center gap-2">
                    <span className="text-center text-sm font-black tabular-nums">{setNumber}</span>
                    <Input
                      aria-label={`${exercise.name}, serie ${setNumber}, carga en kilos`}
                      name={`set:${exercise.id}:${setNumber}:load`}
                      type="number"
                      min="0"
                      max="1000"
                      step="0.25"
                      inputMode="decimal"
                      defaultValue={log?.loadKg ?? ""}
                      placeholder="kg"
                      className="min-w-0 px-2 text-center tabular-nums"
                    />
                    <Input
                      aria-label={`${exercise.name}, serie ${setNumber}, repeticiones reales`}
                      name={`set:${exercise.id}:${setNumber}:reps`}
                      type="number"
                      min="0"
                      max="500"
                      step="1"
                      inputMode="numeric"
                      defaultValue={log?.reps ?? ""}
                      placeholder="reps"
                      className="min-w-0 px-2 text-center tabular-nums"
                    />
                    <Input
                      aria-label={`${exercise.name}, serie ${setNumber}, RIR real`}
                      name={`set:${exercise.id}:${setNumber}:rir`}
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      inputMode="decimal"
                      defaultValue={log?.rir ?? ""}
                      placeholder="RIR"
                      className="min-w-0 px-2 text-center tabular-nums"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-3 border-t border-border bg-surface-muted p-4 sm:flex sm:items-center sm:justify-between sm:p-5">
        <FormMessage state={state} />
        <SubmitButton pendingLabel="Guardando resultados…" className="w-full sm:ml-auto sm:w-auto">
          <Save aria-hidden="true" className="size-4" />
          Guardar resultados
        </SubmitButton>
      </div>
    </form>
  );
}
