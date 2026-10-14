"use client";

import { useActionState, useEffect, useId, useMemo, useState } from "react";
import { CopyPlus, Plus, Trash2 } from "lucide-react";
import { saveWorkoutPlanAction, updateWorkoutPlanAction } from "@/app/actions/admin";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { InternalDatePicker } from "@/components/ui/internal-date-picker";
import { InternalSelect } from "@/components/ui/internal-select";
import { initialActionState } from "@/lib/forms/action-state";
import {
  appendBlankExercise,
  appendBlankSession,
  cloneWorkoutWeek,
  type WorkoutExercise,
  type WorkoutPlan,
  type WorkoutSession,
  type WorkoutWeek,
} from "@/lib/workouts/plan";

const statusOptions = [
  { value: "published", label: "Publicado para el cliente" },
  { value: "draft", label: "Borrador" },
] as const;

const setOptions = [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: String(value) }));

const muscleGroups = [
  "Pectoral",
  "Espalda",
  "Deltoides",
  "Bíceps",
  "Tríceps",
  "Cuádriceps",
  "Isquiosurales",
  "Glúteos",
  "Gemelos",
  "Core",
];

export function WorkoutPlanBuilder({
  clientId,
  clients = [],
  assignmentId,
  initialClientId,
  initialTitle = "",
  initialStartsOn = null,
  initialStatus = "published",
  initialPlan,
  onSuccess,
}: {
  clientId?: string;
  clients?: Array<{ id: string; full_name: string }>;
  assignmentId?: string;
  initialClientId?: string;
  initialTitle?: string;
  initialStartsOn?: string | null;
  initialStatus?: "draft" | "published";
  initialPlan: WorkoutPlan;
  onSuccess?: () => void;
}) {
  const [state, action] = useActionState(assignmentId ? updateWorkoutPlanAction : saveWorkoutPlanAction, initialActionState);
  const formId = useId();
  const [plan, setPlan] = useState(initialPlan);
  const [activeWeekId, setActiveWeekId] = useState(initialPlan.weeks[0].id);
  const activeWeek = plan.weeks.find((week) => week.id === activeWeekId) ?? plan.weeks[0];
  const serializedPlan = useMemo(() => JSON.stringify(plan), [plan]);
  const clientFieldId = `${formId}-client`;
  const titleFieldId = `${formId}-title`;
  const startsOnFieldId = `${formId}-starts-on`;
  const statusFieldId = `${formId}-status`;
  const blockNameFieldId = `${formId}-block-name`;
  const phaseFieldId = `${formId}-phase`;
  const objectiveFieldId = `${formId}-objective`;

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [onSuccess, state.status]);

  const replaceWeek = (weekId: string, update: (week: WorkoutWeek) => WorkoutWeek) => {
    setPlan((current) => ({
      ...current,
      weeks: current.weeks.map((week) => (week.id === weekId ? update(week) : week)),
    }));
  };

  const replaceSession = (
    weekId: string,
    sessionId: string,
    update: (session: WorkoutSession) => WorkoutSession,
  ) => replaceWeek(weekId, (week) => ({
    ...week,
    sessions: week.sessions.map((session) => (session.id === sessionId ? update(session) : session)),
  }));

  const replaceExercise = (
    weekId: string,
    sessionId: string,
    exerciseId: string,
    update: (exercise: WorkoutExercise) => WorkoutExercise,
  ) => replaceSession(weekId, sessionId, (session) => ({
    ...session,
    exercises: session.exercises.map((exercise) => (exercise.id === exerciseId ? update(exercise) : exercise)),
  }));

  const addWeek = () => {
    if (plan.weeks.length >= 16) return;
    const nextWeek = cloneWorkoutWeek(plan.weeks.at(-1)!, plan.weeks.length + 1);
    setPlan((current) => ({ ...current, weeks: [...current.weeks, nextWeek] }));
    setActiveWeekId(nextWeek.id);
  };

  const removeWeek = () => {
    if (plan.weeks.length === 1) return;
    const currentIndex = plan.weeks.findIndex((week) => week.id === activeWeek.id);
    const remainingWeeks = plan.weeks
      .filter((week) => week.id !== activeWeek.id)
      .map((week, index) => ({ ...week, number: index + 1, name: week.name || `Semana ${index + 1}` }));
    setPlan((current) => ({ ...current, weeks: remainingWeeks }));
    setActiveWeekId(remainingWeeks[Math.max(0, currentIndex - 1)].id);
  };

  return (
    <form action={action} className="min-w-0 max-w-full grid gap-6">
      {assignmentId ? <input type="hidden" name="assignmentId" value={assignmentId} /> : null}
      {clientId ? <input type="hidden" name="clientId" value={clientId} /> : null}
      <input type="hidden" name="planData" value={serializedPlan} />
      <FormMessage state={state} />

      <div className={`grid gap-5 md:grid-cols-2 ${clientId ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
        {!clientId ? (
          <Field label="Cliente" htmlFor={clientFieldId} required error={state.fieldErrors?.clientId?.[0]}>
            <InternalSelect
              id={clientFieldId}
              name="clientId"
              ariaLabel="Cliente del entrenamiento"
              options={clients.map((client) => ({ value: client.id, label: client.full_name }))}
              placeholder="Selecciona un cliente"
              defaultValue={initialClientId ?? ""}
              required
              invalid={Boolean(state.fieldErrors?.clientId)}
              menuPortal
            />
          </Field>
        ) : null}
        <Field label="Título" htmlFor={titleFieldId} required error={state.fieldErrors?.title?.[0]}>
          <Input id={titleFieldId} name="title" required defaultValue={initialTitle} placeholder="Hipertrofia · Bloque 1" />
        </Field>
        <Field label="Fecha de inicio" htmlFor={startsOnFieldId} error={state.fieldErrors?.startsOn?.[0]}>
          <InternalDatePicker
            id={startsOnFieldId}
            name="startsOn"
            ariaLabel="Fecha de inicio del entrenamiento"
            defaultValue={initialStartsOn ?? ""}
            invalid={Boolean(state.fieldErrors?.startsOn)}
          />
        </Field>
        <Field label="Estado" htmlFor={statusFieldId} required error={state.fieldErrors?.status?.[0]}>
          <InternalSelect
            id={statusFieldId}
            name="status"
            options={statusOptions}
            defaultValue={initialStatus}
            ariaLabel="Estado del entrenamiento"
            required
            invalid={Boolean(state.fieldErrors?.status)}
            menuPortal
          />
        </Field>
      </div>

      <div className="grid gap-5 border-y border-border py-6 md:grid-cols-2">
        <Field label="Nombre del bloque" htmlFor={blockNameFieldId} required>
          <Input
            id={blockNameFieldId}
            value={plan.blockName}
            onChange={(event) => setPlan((current) => ({ ...current, blockName: event.target.value }))}
            required
          />
        </Field>
        <Field label="Fase o mesociclo" htmlFor={phaseFieldId}>
          <Input
            id={phaseFieldId}
            value={plan.phase}
            placeholder="Acumulación, intensificación…"
            onChange={(event) => setPlan((current) => ({ ...current, phase: event.target.value }))}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Objetivo del bloque" htmlFor={objectiveFieldId}>
            <Textarea
              id={objectiveFieldId}
              rows={2}
              value={plan.objective}
              placeholder="Objetivo principal y criterios para progresar"
              onChange={(event) => setPlan((current) => ({ ...current, objective: event.target.value }))}
            />
          </Field>
        </div>
      </div>

      <section aria-labelledby="weeks-heading" className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 id="weeks-heading" className="text-lg font-black">Semanas del bloque</h3>
            <p className="mt-1 text-sm text-muted">Duplica la semana anterior y ajusta solo lo que cambia.</p>
          </div>
          <Button type="button" variant="outline" onClick={addWeek} disabled={plan.weeks.length >= 16}>
            <CopyPlus aria-hidden="true" className="size-4" />
            Duplicar semana
          </Button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Semanas del entrenamiento">
          {plan.weeks.map((week) => (
            <button
              key={week.id}
              type="button"
              role="tab"
              aria-selected={week.id === activeWeek.id}
              className={`min-h-11 shrink-0 rounded-[var(--radius-md)] border px-4 text-sm font-bold transition-colors ${
                week.id === activeWeek.id
                  ? "border-foreground bg-surface-inverse text-white"
                  : "border-border-strong bg-surface hover:bg-surface-muted"
              }`}
              onClick={() => setActiveWeekId(week.id)}
            >
              Semana {week.number}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-4 grid gap-6">
          <div className="grid gap-5 rounded-[var(--radius-lg)] bg-surface-muted p-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nombre de la semana" htmlFor={`week-${activeWeek.id}-name`}>
              <Input
                id={`week-${activeWeek.id}-name`}
                value={activeWeek.name}
                onChange={(event) => replaceWeek(activeWeek.id, (week) => ({ ...week, name: event.target.value }))}
              />
            </Field>
            <Field label="Fase" htmlFor={`week-${activeWeek.id}-phase`}>
              <Input
                id={`week-${activeWeek.id}-phase`}
                value={activeWeek.phase}
                placeholder={plan.phase || "Fase de la semana"}
                onChange={(event) => replaceWeek(activeWeek.id, (week) => ({ ...week, phase: event.target.value }))}
              />
            </Field>
            <Field label="Pasos diarios" htmlFor={`week-${activeWeek.id}-steps`}>
              <Input
                id={`week-${activeWeek.id}-steps`}
                type="number"
                min="0"
                max="100000"
                step="500"
                inputMode="numeric"
                value={activeWeek.stepsTarget ?? ""}
                placeholder="Ej. 8000"
                onChange={(event) => replaceWeek(activeWeek.id, (week) => ({
                  ...week,
                  stepsTarget: event.target.value ? Number(event.target.value) : null,
                }))}
              />
            </Field>
            <Field label="Cardio" htmlFor={`week-${activeWeek.id}-cardio`}>
              <Input
                id={`week-${activeWeek.id}-cardio`}
                value={activeWeek.cardioNotes}
                placeholder="2 × 20 min Z2"
                onChange={(event) => replaceWeek(activeWeek.id, (week) => ({ ...week, cardioNotes: event.target.value }))}
              />
            </Field>
            <div className="md:col-span-2 xl:col-span-4">
              <Field label="Objetivo semanal" htmlFor={`week-${activeWeek.id}-objective`}>
                <Textarea
                  id={`week-${activeWeek.id}-objective`}
                  rows={2}
                  value={activeWeek.objective}
                  onChange={(event) => replaceWeek(activeWeek.id, (week) => ({ ...week, objective: event.target.value }))}
                />
              </Field>
            </div>
          </div>

          {activeWeek.sessions.map((session) => (
            <section key={session.id} className="rounded-[var(--radius-lg)] border border-border p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Field label={`Sesión ${session.number}`} htmlFor={`session-${session.id}-name`}>
                  <Input
                    id={`session-${session.id}-name`}
                    value={session.name}
                    onChange={(event) => replaceSession(activeWeek.id, session.id, (current) => ({ ...current, name: event.target.value }))}
                  />
                </Field>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11"
                  disabled={activeWeek.sessions.length === 1}
                  onClick={() => replaceWeek(activeWeek.id, (week) => ({
                    ...week,
                    sessions: week.sessions
                      .filter((candidate) => candidate.id !== session.id)
                      .map((candidate, index) => ({ ...candidate, number: index + 1 })),
                  }))}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  Quitar sesión
                </Button>
              </div>

              <div className="mt-5 grid gap-4">
                {session.exercises.map((exercise, exerciseIndex) => (
                  <fieldset key={exercise.id} className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                    <legend className="px-1 text-sm font-black">Ejercicio {exerciseIndex + 1}</legend>
                    <div className="grid gap-4 lg:grid-cols-12">
                      <div className="lg:col-span-3">
                        <Field label="Grupo muscular" htmlFor={`exercise-${exercise.id}-muscle`} required>
                          <Input
                            id={`exercise-${exercise.id}-muscle`}
                            list="workout-muscle-groups"
                            value={exercise.muscleGroup}
                            onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({ ...current, muscleGroup: event.target.value }))}
                            required
                          />
                        </Field>
                      </div>
                      <div className="lg:col-span-5">
                        <Field label="Ejercicio" htmlFor={`exercise-${exercise.id}-name`} required>
                          <Input
                            id={`exercise-${exercise.id}-name`}
                            value={exercise.name}
                            onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({ ...current, name: event.target.value }))}
                            required
                          />
                        </Field>
                      </div>
                      <div className="lg:col-span-2">
                        <Field label="Series" htmlFor={`exercise-${exercise.id}-sets`} required>
                          <InternalSelect
                            id={`exercise-${exercise.id}-sets`}
                            value={String(exercise.sets)}
                            options={setOptions}
                            ariaLabel={`Series de ${exercise.name || `ejercicio ${exerciseIndex + 1}`}`}
                            onValueChange={(value) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => {
                              const sets = Number(value);
                              return {
                                ...current,
                                sets,
                                targetRir: Array.from({ length: sets }, (_, index) => current.targetRir[index] ?? 2),
                              };
                            })}
                          />
                        </Field>
                      </div>
                      <div className="lg:col-span-2">
                        <Field label="Repeticiones" htmlFor={`exercise-${exercise.id}-reps`} required>
                          <Input
                            id={`exercise-${exercise.id}-reps`}
                            value={exercise.reps}
                            placeholder="8-12"
                            onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({ ...current, reps: event.target.value }))}
                            required
                          />
                        </Field>
                      </div>
                      <div className="lg:col-span-4">
                        <Field label="Método / indicación" htmlFor={`exercise-${exercise.id}-method`}>
                          <Input
                            id={`exercise-${exercise.id}-method`}
                            value={exercise.method}
                            placeholder="Tempo, superserie, pausa…"
                            onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({ ...current, method: event.target.value }))}
                          />
                        </Field>
                      </div>
                      <div className="lg:col-span-3">
                        <Field label="Descanso" htmlFor={`exercise-${exercise.id}-rest`}>
                          <Input
                            id={`exercise-${exercise.id}-rest`}
                            value={exercise.rest}
                            placeholder="2 min"
                            onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({ ...current, rest: event.target.value }))}
                          />
                        </Field>
                      </div>
                      <div className="lg:col-span-5">
                        <span className="mb-2 block text-sm font-bold">RIR objetivo por serie</span>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {exercise.targetRir.map((rir, index) => (
                            <label key={index} className="grid gap-1 text-xs font-bold text-muted">
                              Serie {index + 1}
                              <Input
                                aria-label={`RIR objetivo de la serie ${index + 1}`}
                                className="px-2 text-center tabular-nums"
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                inputMode="decimal"
                                value={rir ?? ""}
                                onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({
                                  ...current,
                                  targetRir: current.targetRir.map((value, rirIndex) => (
                                    rirIndex === index ? (event.target.value ? Number(event.target.value) : null) : value
                                  )),
                                }))}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="lg:col-span-12">
                        <Field label="Ejecución y observaciones" htmlFor={`exercise-${exercise.id}-cues`}>
                          <Textarea
                            id={`exercise-${exercise.id}-cues`}
                            rows={2}
                            value={exercise.cues}
                            placeholder="Claves técnicas, progresión o adaptación individual"
                            onChange={(event) => replaceExercise(activeWeek.id, session.id, exercise.id, (current) => ({ ...current, cues: event.target.value }))}
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="min-h-11"
                        disabled={session.exercises.length === 1}
                        onClick={() => replaceSession(activeWeek.id, session.id, (current) => ({
                          ...current,
                          exercises: current.exercises.filter((candidate) => candidate.id !== exercise.id),
                        }))}
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                        Quitar ejercicio
                      </Button>
                    </div>
                  </fieldset>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                disabled={session.exercises.length >= 20}
                onClick={() => replaceSession(activeWeek.id, session.id, appendBlankExercise)}
              >
                <Plus aria-hidden="true" className="size-4" />
                Añadir ejercicio
              </Button>
            </section>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={activeWeek.sessions.length >= 8}
              onClick={() => replaceWeek(activeWeek.id, appendBlankSession)}
            >
              <Plus aria-hidden="true" className="size-4" />
              Añadir sesión
            </Button>
            <Button type="button" variant="ghost" disabled={plan.weeks.length === 1} onClick={removeWeek}>
              <Trash2 aria-hidden="true" className="size-4" />
              Eliminar esta semana
            </Button>
          </div>
        </div>
      </section>

      <datalist id="workout-muscle-groups">
        {muscleGroups.map((muscle) => <option key={muscle} value={muscle} />)}
      </datalist>
      {state.fieldErrors?.planData?.[0] ? (
        <p className="text-sm font-medium text-danger" role="alert">{state.fieldErrors.planData[0]}</p>
      ) : null}
      <SubmitButton pendingLabel={assignmentId ? "Actualizando entrenamiento…" : "Guardando entrenamiento…"} className="w-full sm:w-auto">
        {assignmentId ? "Actualizar entrenamiento" : "Guardar entrenamiento"}
      </SubmitButton>
    </form>
  );
}
