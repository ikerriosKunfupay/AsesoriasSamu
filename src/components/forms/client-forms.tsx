"use client";

import { useActionState } from "react";
import { createCheckInAction, saveOnboardingAction } from "@/app/actions/client";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import { initialActionState } from "@/lib/forms/action-state";
import {
  sanitizeUnsignedDecimalInput,
  sanitizeUnsignedIntegerInput,
} from "@/lib/forms/numeric-values";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

const sexOptions = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "otro", label: "Otro" },
  { value: "prefiero_no_indicar", label: "Prefiero no indicar" },
] as const;

const onboardingFieldHelp = {
  occupationSchedule: {
    description: "Sirve para entender cuánto te mueves fuera del entrenamiento y qué partes de tu rutina condicionan el descanso y la disponibilidad.",
    examples: [
      "A qué te dedicas y cómo es tu jornada habitual.",
      "Horarios, turnos, desplazamientos y teletrabajo.",
      "Cuánto tiempo pasas sentado, de pie o realizando esfuerzo físico.",
      "Obligaciones familiares y horas habituales de sueño.",
    ],
  },
  trainingPriority: {
    description: "Ayuda a preparar una planificación que puedas cumplir de forma realista y sostenible, no solo sobre el papel.",
    examples: [
      "Qué días y franjas horarias tienes disponibles.",
      "Cuánto tiempo real puedes dedicar a cada sesión.",
      "Tu experiencia entrenando y las actividades que prefieres.",
      "Dónde entrenarás, qué material tienes y qué suele impedirte ser constante.",
    ],
  },
  mealAvailability: {
    description: "Permite organizar la alimentación alrededor de tus horarios reales y evitar recomendaciones difíciles de mantener.",
    examples: [
      "A qué hora te levantas, comes y te acuestas normalmente.",
      "Cuándo puedes cocinar y cuánto tiempo tienes para hacerlo.",
      "Si comes fuera, llevas comida preparada o trabajas por turnos.",
      "Quién se encarga de la compra y la cocina en casa.",
    ],
  },
  goals: {
    description: "Explica qué quieres conseguir y por qué es importante para ti. Esto ayuda a priorizar el plan y medir un progreso que tenga sentido.",
    examples: [
      "Tu objetivo principal y otros objetivos secundarios.",
      "Qué cambio te gustaría notar en tu día a día.",
      "Qué has probado anteriormente y qué te costó mantener.",
      "Cómo sabrías que el proceso está funcionando para ti.",
    ],
  },
  conditionsInjuries: {
    description: "Indica únicamente la información práctica que permita adaptar el ejercicio y evitar movimientos o cargas que no sean adecuados para ti.",
    examples: [
      "Limitaciones actuales o actividades que no puedes realizar.",
      "Movimientos que te provocan molestias.",
      "Recomendaciones relevantes que te haya dado un profesional.",
      "Cómo afecta esa limitación a tu rutina diaria.",
    ],
    privacyNote: "No pegues diagnósticos, historiales ni informes médicos completos.",
  },
  allergiesIntolerances: {
    description: "Cuenta qué alimentos o ingredientes debes evitar y cómo condicionan tu alimentación habitual para que las pautas sean seguras y prácticas.",
    examples: [
      "Alimentos o ingredientes concretos que debes evitar.",
      "Si se trata de una alergia o una intolerancia ya conocida.",
      "Productos o situaciones en las que sueles encontrarla.",
      "Alternativas que ya utilizas con normalidad.",
    ],
    privacyNote: "No adjuntes ni copies informes médicos; basta con la información necesaria para adaptar la pauta.",
  },
} as const;

function sanitizeInput(
  event: React.FormEvent<HTMLInputElement>,
  sanitizer: (value: string) => string,
) {
  const sanitizedValue = sanitizer(event.currentTarget.value);
  if (sanitizedValue !== event.currentTarget.value) {
    event.currentTarget.value = sanitizedValue;
  }
}

export function OnboardingForm({ initial }: { initial?: Record<string, string | number | null> }) {
  const [state, action] = useActionState(saveOnboardingAction, initialActionState);
  return (
    <form action={action} className="grid gap-6">
      <FormMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Edad" htmlFor="age" required error={state.fieldErrors?.age?.[0]}>
          <Input
            id="age"
            name="age"
            type="text"
            inputMode="numeric"
            pattern="[0-9]+"
            autoComplete="off"
            defaultValue={initial?.age ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.age?.[0]) || undefined}
            aria-describedby={state.fieldErrors?.age?.[0] ? "age-error" : undefined}
            onInput={(event) => sanitizeInput(event, sanitizeUnsignedIntegerInput)}
            required
          />
        </Field>
        <Field label="Sexo" htmlFor="sex" required error={state.fieldErrors?.sex?.[0]}>
          <InternalSelect
            id="sex"
            name="sex"
            options={sexOptions}
            defaultValue={String(initial?.sex ?? "")}
            placeholder="Selecciona"
            ariaLabel="Sexo"
            required
            invalid={Boolean(state.fieldErrors?.sex?.[0])}
          />
        </Field>
        <Field label="Peso en ayunas (kg)" htmlFor="weightKg" required error={state.fieldErrors?.weightKg?.[0]}>
          <Input
            id="weightKg"
            name="weightKg"
            type="text"
            inputMode="decimal"
            pattern="[0-9]+([.,][0-9]+)?"
            autoComplete="off"
            defaultValue={initial?.weight_kg ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.weightKg?.[0]) || undefined}
            aria-describedby={state.fieldErrors?.weightKg?.[0] ? "weightKg-error" : undefined}
            onInput={(event) => sanitizeInput(event, sanitizeUnsignedDecimalInput)}
            required
          />
        </Field>
        <Field label="Altura (cm)" htmlFor="heightCm" required error={state.fieldErrors?.heightCm?.[0]}>
          <Input
            id="heightCm"
            name="heightCm"
            type="text"
            inputMode="decimal"
            pattern="[0-9]+([.,][0-9]+)?"
            autoComplete="off"
            defaultValue={initial?.height_cm ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.heightCm?.[0]) || undefined}
            aria-describedby={state.fieldErrors?.heightCm?.[0] ? "heightCm-error" : undefined}
            onInput={(event) => sanitizeInput(event, sanitizeUnsignedDecimalInput)}
            required
          />
        </Field>
      </div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <Field label="Trabajo, horarios y rutina semanal" htmlFor="occupationSchedule" required error={state.fieldErrors?.occupationSchedule?.[0]} help={onboardingFieldHelp.occupationSchedule}>
          <Textarea id="occupationSchedule" name="occupationSchedule" rows={5} defaultValue={String(initial?.occupation_schedule ?? "")} required />
        </Field>
        <Field label="Prioridad y disponibilidad para entrenar" htmlFor="trainingPriority" required error={state.fieldErrors?.trainingPriority?.[0]} help={onboardingFieldHelp.trainingPriority}>
          <Textarea id="trainingPriority" name="trainingPriority" rows={5} defaultValue={String(initial?.training_priority ?? "")} required />
        </Field>
      </div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <Field label="Horarios y disponibilidad para las comidas" htmlFor="mealAvailability" required error={state.fieldErrors?.mealAvailability?.[0]} help={onboardingFieldHelp.mealAvailability}>
          <Textarea id="mealAvailability" name="mealAvailability" rows={5} defaultValue={String(initial?.meal_availability ?? "")} required />
        </Field>
        <Field label="Objetivos" htmlFor="goals" required error={state.fieldErrors?.goals?.[0]} help={onboardingFieldHelp.goals}>
          <Textarea id="goals" name="goals" rows={5} defaultValue={String(initial?.goals ?? "")} required />
        </Field>
      </div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <Field label="Enfermedades, lesiones o limitaciones" htmlFor="conditionsInjuries" error={state.fieldErrors?.conditionsInjuries?.[0]} hint="Si no tienes ninguna, puedes dejarlo en blanco." help={onboardingFieldHelp.conditionsInjuries}>
          <Textarea id="conditionsInjuries" name="conditionsInjuries" rows={5} defaultValue={String(initial?.conditions_injuries ?? "")} />
        </Field>
        <Field label="Alergias o intolerancias" htmlFor="allergiesIntolerances" error={state.fieldErrors?.allergiesIntolerances?.[0]} hint="Si no tienes ninguna, puedes dejarlo en blanco." help={onboardingFieldHelp.allergiesIntolerances}>
          <Textarea id="allergiesIntolerances" name="allergiesIntolerances" rows={5} defaultValue={String(initial?.allergies_intolerances ?? "")} />
        </Field>
      </div>
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
