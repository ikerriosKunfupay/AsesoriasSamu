"use client";

import { useActionState } from "react";
import { createCheckInAction, saveOnboardingAction } from "@/app/actions/client";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function OnboardingForm({ initial }: { initial?: Record<string, string | number | null> }) {
  const [state, action] = useActionState(saveOnboardingAction, initialActionState);
  return (
    <form action={action} className="grid gap-6">
      <FormMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Edad" htmlFor="age" required error={state.fieldErrors?.age?.[0]}>
          <Input id="age" name="age" type="number" min="16" max="90" defaultValue={initial?.age ?? ""} required />
        </Field>
        <Field label="Sexo" htmlFor="sex" required error={state.fieldErrors?.sex?.[0]}>
          <select id="sex" name="sex" defaultValue={String(initial?.sex ?? "")} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5" required>
            <option value="">Selecciona</option><option value="mujer">Mujer</option><option value="hombre">Hombre</option><option value="otro">Otro</option><option value="prefiero_no_indicar">Prefiero no indicar</option>
          </select>
        </Field>
        <Field label="Peso en ayunas (kg)" htmlFor="weightKg" required error={state.fieldErrors?.weightKg?.[0]}>
          <Input id="weightKg" name="weightKg" type="number" min="35" max="300" step="0.1" defaultValue={initial?.weight_kg ?? ""} required />
        </Field>
        <Field label="Altura (cm)" htmlFor="heightCm" required error={state.fieldErrors?.heightCm?.[0]}>
          <Input id="heightCm" name="heightCm" type="number" min="120" max="230" defaultValue={initial?.height_cm ?? ""} required />
        </Field>
      </div>
      <Field label="Trabajo, horarios y rutina semanal" htmlFor="occupationSchedule" required error={state.fieldErrors?.occupationSchedule?.[0]}>
        <Textarea id="occupationSchedule" name="occupationSchedule" defaultValue={String(initial?.occupation_schedule ?? "")} required />
      </Field>
      <Field label="Prioridad y disponibilidad para entrenar" htmlFor="trainingPriority" required error={state.fieldErrors?.trainingPriority?.[0]}>
        <Textarea id="trainingPriority" name="trainingPriority" defaultValue={String(initial?.training_priority ?? "")} required />
      </Field>
      <Field label="Horarios y disponibilidad para las comidas" htmlFor="mealAvailability" required error={state.fieldErrors?.mealAvailability?.[0]}>
        <Textarea id="mealAvailability" name="mealAvailability" defaultValue={String(initial?.meal_availability ?? "")} required />
      </Field>
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Enfermedades, lesiones o limitaciones" htmlFor="conditionsInjuries" error={state.fieldErrors?.conditionsInjuries?.[0]} hint="Si no tienes ninguna, puedes dejarlo en blanco.">
          <Textarea id="conditionsInjuries" name="conditionsInjuries" defaultValue={String(initial?.conditions_injuries ?? "")} />
        </Field>
        <Field label="Alergias o intolerancias" htmlFor="allergiesIntolerances" error={state.fieldErrors?.allergiesIntolerances?.[0]}>
          <Textarea id="allergiesIntolerances" name="allergiesIntolerances" defaultValue={String(initial?.allergies_intolerances ?? "")} />
        </Field>
      </div>
      <Field label="Objetivos" htmlFor="goals" required error={state.fieldErrors?.goals?.[0]}>
        <Textarea id="goals" name="goals" rows={5} defaultValue={String(initial?.goals ?? "")} required />
      </Field>
      <Field label="Redes sociales (opcional)" htmlFor="socialNetworks" error={state.fieldErrors?.socialNetworks?.[0]}>
        <Input id="socialNetworks" name="socialNetworks" defaultValue={String(initial?.social_networks ?? "")} />
      </Field>
      <label className="flex gap-3 rounded-[var(--radius-md)] border border-border bg-surface-muted p-4 text-sm leading-6">
        <input name="healthConsent" type="checkbox" className="mt-1 size-4 accent-primary" required />
        <span>Acepto que Team Ortega trate estos datos, incluidos los relativos a salud, únicamente para preparar y hacer seguimiento de mi plan.</span>
      </label>
      {state.fieldErrors?.healthConsent?.[0] ? <p className="text-sm text-danger">{state.fieldErrors.healthConsent[0]}</p> : null}
      <SubmitButton pendingLabel="Guardando…">Guardar cuestionario</SubmitButton>
    </form>
  );
}

export function CheckInForm() {
  const [state, action] = useActionState(createCheckInAction, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <Field label="Peso actual (kg, opcional)" htmlFor="weightKg" error={state.fieldErrors?.weightKg?.[0]}>
        <Input id="weightKg" name="weightKg" type="number" min="35" max="300" step="0.1" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nivel de energía" htmlFor="energyLevel" required error={state.fieldErrors?.energyLevel?.[0]} hint="1 = muy bajo · 5 = muy alto">
          <Input id="energyLevel" name="energyLevel" type="number" min="1" max="5" defaultValue="3" required />
        </Field>
        <Field label="Adherencia al plan" htmlFor="adherenceLevel" required error={state.fieldErrors?.adherenceLevel?.[0]} hint="1 = baja · 5 = completa">
          <Input id="adherenceLevel" name="adherenceLevel" type="number" min="1" max="5" defaultValue="3" required />
        </Field>
      </div>
      <Field label="¿Cómo ha ido la semana?" htmlFor="notes" error={state.fieldErrors?.notes?.[0]}>
        <Textarea id="notes" name="notes" rows={5} />
      </Field>
      <SubmitButton pendingLabel="Enviando…">Enviar seguimiento</SubmitButton>
    </form>
  );
}
