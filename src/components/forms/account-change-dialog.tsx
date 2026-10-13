"use client";

import Link from "next/link";
import { KeyRound, Mail, X } from "lucide-react";
import { useActionState } from "react";
import { changeEmailAction, changePasswordAction } from "@/app/actions/account-security";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { PASSWORD_MIN_LENGTH } from "@/lib/forms/password-policy";
import { FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";
import { SubmitButton } from "./submit-button";

function DialogFrame({
  children,
  description,
  icon,
  title,
}: {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-change-title"
        aria-describedby="account-change-description"
        className="relative w-full max-w-lg rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-2xl sm:p-8"
      >
        <Link
          href="/app/ajustes"
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X className="size-5" aria-hidden="true" />
        </Link>
        <div className="grid size-12 place-items-center rounded-full bg-danger-soft text-primary">
          {icon}
        </div>
        <h1 id="account-change-title" className="font-display mt-5 pr-10 text-3xl font-black uppercase leading-none sm:text-4xl">
          {title}
        </h1>
        <p id="account-change-description" className="mt-3 text-sm leading-6 text-muted sm:text-base">
          {description}
        </p>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}

export function ChangeEmailDialog({ currentEmail }: { currentEmail: string }) {
  const [state, action] = useActionState(changeEmailAction, initialActionState);

  return (
    <DialogFrame
      title="Nuevo correo"
      description={`Ya hemos verificado que eres tú mediante ${currentEmail}. Escribe la nueva dirección que quieres usar.`}
      icon={<Mail className="size-6" aria-hidden="true" />}
    >
      <form action={action} className="grid gap-5" noValidate>
        <FormMessage state={state} />
        <Field label="Nuevo correo electrónico" htmlFor="newEmail" required error={state.fieldErrors?.newEmail?.[0]}>
          <Input
            id="newEmail"
            name="newEmail"
            type="email"
            autoComplete="email"
            autoFocus
            required
            aria-invalid={Boolean(state.fieldErrors?.newEmail?.[0]) || undefined}
          />
        </Field>
        <SubmitButton pendingLabel="Actualizando…" className="w-full">
          Actualizar correo
        </SubmitButton>
      </form>
    </DialogFrame>
  );
}

export function ChangePasswordDialog() {
  const [state, action] = useActionState(changePasswordAction, initialActionState);

  return (
    <DialogFrame
      title="Nueva contraseña"
      description={`Tu identidad ya está verificada. Elige una contraseña única de al menos ${PASSWORD_MIN_LENGTH} caracteres.`}
      icon={<KeyRound className="size-6" aria-hidden="true" />}
    >
      <form action={action} className="grid gap-5" noValidate>
        <FormMessage state={state} />
        <Field label="Nueva contraseña" htmlFor="password" required hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`} error={state.fieldErrors?.password?.[0]}>
          <PasswordInput
            id="password"
            name="password"
            minLength={PASSWORD_MIN_LENGTH}
            error={state.fieldErrors?.password?.[0]}
            describedBy={state.fieldErrors?.password?.[0] ? "password-error" : "password-hint"}
          />
        </Field>
        <Field label="Repite la contraseña" htmlFor="confirmation" required error={state.fieldErrors?.confirmation?.[0]}>
          <PasswordInput
            id="confirmation"
            name="confirmation"
            minLength={PASSWORD_MIN_LENGTH}
            error={state.fieldErrors?.confirmation?.[0]}
            describedBy={state.fieldErrors?.confirmation?.[0] ? "confirmation-error" : undefined}
          />
        </Field>
        <SubmitButton pendingLabel="Actualizando…" className="w-full">
          Actualizar contraseña
        </SubmitButton>
      </form>
    </DialogFrame>
  );
}
