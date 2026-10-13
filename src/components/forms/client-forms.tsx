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
import { FormErrorToast } from "./form-error-toast";
import { FormMessage } from "./form-message";
import { HealthConsentField } from "./health-consent-field";
import { SubmitButton } from "./submit-button";
import { SocialNetworksField } from "./social-networks-field";

function OnboardingSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="grid min-w-0 gap-5 rounded-[var(--radius-lg)] border border-border bg-surface-muted/45 p-4 sm:p-6"
    >
      <div className="grid gap-1.5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 id={`${id}-title`} className="text-xl font-black tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      </div>
      {children}
    </section>
  );
}

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
  const healthConsentError = state.fieldErrors?.healthConsent?.[0];
  const heightError = state.fieldErrors?.heightCm?.[0];
  const heightDescription = [heightError ? "heightCm-error" : null, "heightCm-help"]
    .filter(Boolean)
    .join(" ");

  return (
    <form action={action} className="grid gap-6" noValidate>
      <FormErrorToast
        message={state.status === "error" ? healthConsentError ?? state.message : undefined}
        messageId={state.status === "error" ? state.messageId : undefined}
      />
      {state.status === "success" ? <FormMessage state={state} /> : null}
      <OnboardingSection
        id="physical-data"
        eyebrow="01 · Datos básicos"
        title="Datos físicos"
        description="Indica tus datos actuales. Se utilizarán como punto de partida para adaptar y revisar tu planificación."
      >
        <div className="grid items-start gap-5 sm:grid-cols-2">
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
          <Field label="Altura (cm o m)" htmlFor="heightCm" required error={heightError}>
            <Input
              id="heightCm"
              name="heightCm"
              type="text"
              inputMode="decimal"
              pattern="[0-9]+([.,][0-9]+)?"
              autoComplete="off"
              defaultValue={initial?.height_cm ?? ""}
              aria-invalid={Boolean(heightError) || undefined}
              aria-describedby={heightDescription}
              onInput={(event) => sanitizeInput(event, sanitizeUnsignedDecimalInput)}
              required
            />
          </Field>
        </div>
        <p id="heightCm-help" className="text-sm leading-relaxed text-muted">
          Puedes escribir la altura como <strong className="text-foreground">169 cm</strong> o
          como <strong className="text-foreground">1,69 m</strong>; se guardará siempre en
          centímetros.
        </p>
      </OnboardingSection>

      <OnboardingSection
        id="daily-routine"
        eyebrow="02 · Organización"
        title="Rutina y disponibilidad"
        description="Cuéntanos cómo es tu semana para construir un plan que encaje de verdad en tus horarios."
      >
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <Field label="Trabajo, horarios y rutina semanal" htmlFor="occupationSchedule" required error={state.fieldErrors?.occupationSchedule?.[0]} help={onboardingFieldHelp.occupationSchedule}>
            <Textarea id="occupationSchedule" name="occupationSchedule" rows={5} defaultValue={String(initial?.occupation_schedule ?? "")} required />
          </Field>
          <Field label="Prioridad y disponibilidad para entrenar" htmlFor="trainingPriority" required error={state.fieldErrors?.trainingPriority?.[0]} help={onboardingFieldHelp.trainingPriority}>
            <Textarea id="trainingPriority" name="trainingPriority" rows={5} defaultValue={String(initial?.training_priority ?? "")} required />
          </Field>
        </div>
      </OnboardingSection>

      <OnboardingSection
        id="nutrition-goals"
        eyebrow="03 · Planificación"
        title="Alimentación y objetivos"
        description="Describe tus horarios de comida y el resultado que quieres conseguir para definir prioridades realistas."
      >
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <Field label="Horarios y disponibilidad para las comidas" htmlFor="mealAvailability" required error={state.fieldErrors?.mealAvailability?.[0]} help={onboardingFieldHelp.mealAvailability}>
            <Textarea id="mealAvailability" name="mealAvailability" rows={5} defaultValue={String(initial?.meal_availability ?? "")} required />
          </Field>
          <Field label="Objetivos" htmlFor="goals" required error={state.fieldErrors?.goals?.[0]} help={onboardingFieldHelp.goals}>
            <Textarea id="goals" name="goals" rows={5} defaultValue={String(initial?.goals ?? "")} required />
          </Field>
        </div>
      </OnboardingSection>

      <OnboardingSection
        id="health-adaptations"
        eyebrow="04 · Adaptaciones"
        title="Salud y necesidades específicas"
        description="Comparte solo la información práctica imprescindible para adaptar el entrenamiento y la alimentación con seguridad."
      >
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <Field label="Enfermedades, lesiones o limitaciones" htmlFor="conditionsInjuries" error={state.fieldErrors?.conditionsInjuries?.[0]} hint="Si no tienes ninguna, puedes dejarlo en blanco." help={onboardingFieldHelp.conditionsInjuries}>
            <Textarea id="conditionsInjuries" name="conditionsInjuries" rows={5} defaultValue={String(initial?.conditions_injuries ?? "")} />
          </Field>
          <Field label="Alergias o intolerancias" htmlFor="allergiesIntolerances" error={state.fieldErrors?.allergiesIntolerances?.[0]} hint="Si no tienes ninguna, puedes dejarlo en blanco." help={onboardingFieldHelp.allergiesIntolerances}>
            <Textarea id="allergiesIntolerances" name="allergiesIntolerances" rows={5} defaultValue={String(initial?.allergies_intolerances ?? "")} />
          </Field>
        </div>
      </OnboardingSection>

      <OnboardingSection
        id="additional-data"
        eyebrow="05 · Finalizar"
        title="Información adicional y consentimiento"
        description="Añade tus redes solo si quieres compartirlas y confirma el tratamiento de los datos necesarios para prestar el servicio."
      >
        <SocialNetworksField
          initialValue={String(initial?.social_networks ?? "")}
          error={state.fieldErrors?.socialNetworks?.[0]}
        />
        <HealthConsentField error={healthConsentError} />
      </OnboardingSection>
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
