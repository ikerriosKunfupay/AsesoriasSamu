"use client";

import { Check, ChevronDown } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
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
] as const;

function PhonePrefixSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = phonePrefixes.findIndex((prefix) => prefix.value === value);
  const selectedPrefix = phonePrefixes[selectedIndex] ?? phonePrefixes[0];

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  const openMenu = (focusIndex = selectedIndex) => {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[focusIndex]?.focus());
  };

  const selectPrefix = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + direction + phonePrefixes.length) % phonePrefixes.length;
      optionRefs.current[nextIndex]?.focus();
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionRefs.current[event.key === "Home" ? 0 : phonePrefixes.length - 1]?.focus();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative w-[7.25rem] shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Prefijo telefónico, ${selectedPrefix.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="phone-prefix-options"
        className="flex min-h-12 w-full items-center justify-between border-r border-border-strong pr-3 text-left text-sm font-black text-foreground"
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(event.key === "ArrowDown" ? selectedIndex : Math.max(selectedIndex - 1, 0));
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <span>{selectedPrefix.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted"}`}
        />
      </button>
      {isOpen ? (
        <div
          id="phone-prefix-options"
          role="listbox"
          aria-label="Prefijos telefónicos"
          className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-40 border-t-4 border-primary bg-surface-inverse py-1 text-white shadow-2xl [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)]"
        >
          {phonePrefixes.map((prefix, index) => {
            const isSelected = prefix.value === value;
            return (
              <button
                key={prefix.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex min-h-11 w-full items-center justify-between px-4 text-left text-sm font-black transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none ${isSelected ? "text-primary" : "text-white"}`}
                onClick={() => selectPrefix(prefix.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span>{prefix.label}</span>
                {isSelected ? <Check aria-hidden="true" className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

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
