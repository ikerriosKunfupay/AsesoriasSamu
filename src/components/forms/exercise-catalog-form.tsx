"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { deleteExerciseCatalogAction, saveExerciseCatalogAction } from "@/app/actions/admin";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import type { ExerciseCatalogItem } from "@/lib/admin/exercise-catalog";
import { initialActionState } from "@/lib/forms/action-state";

export function ExerciseCatalogForm({
  muscleGroups,
  initialExercise,
  onSuccess,
}: {
  muscleGroups: string[];
  initialExercise?: ExerciseCatalogItem;
  onSuccess?: () => void;
}) {
  const [state, action] = useActionState(saveExerciseCatalogAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();

  useEffect(() => {
    if (state.status !== "success") return;
    if (!initialExercise) formRef.current?.reset();
    onSuccess?.();
  }, [initialExercise, onSuccess, state.status]);

  return (
    <form ref={formRef} action={action} className="grid gap-5">
      {initialExercise ? <input type="hidden" name="exerciseId" value={initialExercise.id} /> : null}
      <FormMessage state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Grupo muscular" htmlFor={`${formId}-muscle`} required error={state.fieldErrors?.muscleGroup?.[0]}>
          <Input
            id={`${formId}-muscle`}
            name="muscleGroup"
            list={`${formId}-muscle-options`}
            defaultValue={initialExercise?.muscleGroup ?? ""}
            placeholder="Ej. CUÁDRICEPS"
            autoComplete="off"
            required
          />
          <datalist id={`${formId}-muscle-options`}>
            {muscleGroups.map((muscleGroup) => <option key={muscleGroup} value={muscleGroup} />)}
          </datalist>
        </Field>
        <Field label="Nombre del ejercicio" htmlFor={`${formId}-name`} required error={state.fieldErrors?.name?.[0]}>
          <Input id={`${formId}-name`} name="name" defaultValue={initialExercise?.name ?? ""} required />
        </Field>
      </div>
      <Field label="Enlace de técnica" htmlFor={`${formId}-url`} error={state.fieldErrors?.referenceUrl?.[0]}>
        <Input
          id={`${formId}-url`}
          name="referenceUrl"
          type="url"
          inputMode="url"
          defaultValue={initialExercise?.referenceUrl ?? ""}
          placeholder="https://…"
        />
      </Field>
      <Field label="Claves y consejos" htmlFor={`${formId}-cues`} error={state.fieldErrors?.cues?.[0]}>
        <Textarea
          id={`${formId}-cues`}
          name="cues"
          rows={7}
          defaultValue={initialExercise?.cues ?? ""}
          placeholder="Añade las indicaciones que se copiarán al entrenamiento…"
        />
      </Field>
      <SubmitButton pendingLabel={initialExercise ? "Actualizando…" : "Añadiendo…"}>
        {initialExercise ? "Guardar cambios" : "Añadir a la biblioteca"}
      </SubmitButton>
    </form>
  );
}

export function DeleteExerciseCatalogForm({ exerciseId, onSuccess }: { exerciseId: string; onSuccess?: () => void }) {
  const [state, action] = useActionState(deleteExerciseCatalogAction, initialActionState);

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="exerciseId" value={exerciseId} />
      <FormMessage state={state} />
      <SubmitButton className="bg-danger hover:opacity-90" pendingLabel="Eliminando…">Eliminar ejercicio</SubmitButton>
    </form>
  );
}
