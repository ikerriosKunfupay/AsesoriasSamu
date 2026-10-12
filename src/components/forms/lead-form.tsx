"use client";

import { useActionState, useState } from "react";
import { createLeadAction } from "@/app/actions/leads";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function LeadForm() {
  const [state, action] = useActionState(createLeadAction, initialActionState);
  const [startedAt] = useState(() => Date.now());

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
        <Field label="Teléfono" htmlFor="phone" required error={state.fieldErrors?.phone?.[0]}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </Field>
      </div>
      <Field label="¿Qué te gustaría conseguir?" htmlFor="goal" required error={state.fieldErrors?.goal?.[0]}>
        <Textarea id="goal" name="goal" rows={5} required placeholder="Cuéntanos tu objetivo y qué te está costando ahora." />
      </Field>
      <Field label="¿Cómo prefieres que contactemos?" htmlFor="contactPreference" required error={state.fieldErrors?.contactPreference?.[0]}>
        <select id="contactPreference" name="contactPreference" defaultValue="whatsapp" className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5">
          <option value="whatsapp">WhatsApp</option>
          <option value="phone">Llamada</option>
          <option value="email">Correo electrónico</option>
        </select>
      </Field>
      <p className="text-xs leading-5 text-muted">
        Usaremos estos datos únicamente para responder a tu solicitud. No envíes información médica en este formulario.
      </p>
      <SubmitButton pendingLabel="Enviando…" className="w-full sm:w-auto">Enviar solicitud</SubmitButton>
    </form>
  );
}
