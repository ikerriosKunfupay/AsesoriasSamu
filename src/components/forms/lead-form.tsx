"use client";

import { useActionState, useState } from "react";
import { createLeadAction } from "@/app/actions/leads";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

const phonePrefixes = [
  { value: "+34", label: "ES +34" },
  { value: "+351", label: "PT +351" },
  { value: "+33", label: "FR +33" },
  { value: "+44", label: "UK +44" },
  { value: "+49", label: "DE +49" },
  { value: "+39", label: "IT +39" },
] as const;

const contactMethods = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Llamada" },
  { value: "email", label: "Correo" },
] as const;

export function LeadForm() {
  const [state, action] = useActionState(createLeadAction, initialActionState);
  const [startedAt] = useState(() => Date.now());
  const [phonePrefix, setPhonePrefix] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  const normalizedPhone = phoneNumber.trim().startsWith("+")
    ? phoneNumber.trim()
    : `${phonePrefix} ${phoneNumber.trim()}`.trim();

  if (state.status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] bg-success-soft p-6 text-success" role="status">
        <p className="text-lg font-black">Solicitud recibida</p>
        <p className="mt-2 leading-7">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="startedAt" value={startedAt} />
      <input className="hidden" aria-hidden="true" name="website" tabIndex={-1} autoComplete="off" />
      <FormMessage state={state} />
      <Field label="Nombre y apellidos" htmlFor="fullName" required error={state.fieldErrors?.fullName?.[0]}>
        <Input id="fullName" name="fullName" autoComplete="name" required />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Correo electrónico" htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Teléfono" htmlFor="phoneNumber" required error={state.fieldErrors?.phone?.[0]}>
          <input type="hidden" name="phone" value={normalizedPhone} />
          <div className="flex min-h-12 overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface focus-within:border-primary">
            <select
              aria-label="Prefijo telefónico"
              className="min-h-12 shrink-0 border-r border-border-strong bg-surface px-3 text-sm font-bold text-foreground"
              value={phonePrefix}
              onChange={(event) => setPhonePrefix(event.target.value)}
            >
              {phonePrefixes.map((prefix) => (
                <option key={prefix.value} value={prefix.value}>{prefix.label}</option>
              ))}
            </select>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="600 000 000"
              className="min-h-12 min-w-0 flex-1 bg-transparent px-3.5 text-base text-foreground placeholder:text-muted/70"
            />
          </div>
        </Field>
      </div>
      <Field label="¿Qué te gustaría conseguir?" htmlFor="goal" required error={state.fieldErrors?.goal?.[0]}>
        <Textarea id="goal" name="goal" rows={5} required placeholder="Cuéntanos tu objetivo y qué te está costando ahora." />
      </Field>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold">
          ¿Cómo prefieres que contactemos?
          <span className="ml-1 text-primary" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {contactMethods.map((method) => (
            <label
              key={method.value}
              className="flex min-h-12 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 text-center text-sm font-bold transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:text-primary"
            >
              <input
                className="sr-only"
                type="radio"
                name="contactPreference"
                value={method.value}
                defaultChecked={method.value === "whatsapp"}
                required
              />
              {method.label}
            </label>
          ))}
        </div>
        {state.fieldErrors?.contactPreference?.[0] ? (
          <p className="text-sm font-medium text-danger" role="alert">
            {state.fieldErrors.contactPreference[0]}
          </p>
        ) : null}
      </fieldset>
      <p className="text-xs leading-5 text-muted">
        Usaremos estos datos únicamente para responder a tu solicitud. No envíes información médica en este formulario.
      </p>
      <SubmitButton pendingLabel="Enviando…" className="w-full sm:w-auto">Enviar solicitud</SubmitButton>
    </form>
  );
}
