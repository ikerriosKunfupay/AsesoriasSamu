"use client";

import { useActionState, useState } from "react";
import { createLeadAction } from "@/app/actions/leads";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { PhonePrefixSelect } from "./phone-prefix-select";
import { formatPhoneValue } from "@/lib/forms/phone";
import { SubmitButton } from "./submit-button";

const contactMethods = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Llamada" },
] as const;

export function LeadForm() {
  const [state, action] = useActionState(createLeadAction, initialActionState);
  const [startedAt] = useState(() => Date.now());
  const [phonePrefix, setPhonePrefix] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  const normalizedPhone = formatPhoneValue(phonePrefix, phoneNumber);

  if (state.status === "success") {
    return (
      <div className="border-l-4 border-success bg-success-soft p-6 text-success" role="status">
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
          <div className="flex min-h-12 border-b border-border-strong focus-within:border-primary">
            <PhonePrefixSelect
              value={phonePrefix}
              onChange={setPhonePrefix}
            />
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
              className="min-h-12 min-w-0 flex-1 border-0 bg-transparent pl-4 text-base text-foreground placeholder:text-muted/70"
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
        <div className="grid grid-cols-2 border-y border-foreground/30" role="radiogroup">
          {contactMethods.map((method) => (
            <label
              key={method.value}
              className="flex min-h-13 cursor-pointer items-center justify-center border-r border-foreground/30 px-2 text-center text-xs font-black tracking-[0.04em] uppercase transition-colors last:border-r-0 has-[:checked]:bg-primary has-[:checked]:text-white"
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
