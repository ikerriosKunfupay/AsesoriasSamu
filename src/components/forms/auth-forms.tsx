"use client";

import Link from "next/link";
import { AlertCircle, Eye, EyeOff, X } from "lucide-react";
import { useActionState, useState } from "react";
import {
  loginAction,
  registerAction,
  requestPasswordResetAction,
  updatePasswordAction,
} from "@/app/actions/auth";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

function FormErrorToast({ message, messageId }: { message?: string; messageId?: string }) {
  const [dismissedId, setDismissedId] = useState<string>();

  if (!message || !messageId || dismissedId === messageId) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 z-50 flex w-[min(calc(100%-2rem),32rem)] -translate-x-1/2 items-start gap-3 border-l-4 border-white bg-danger px-4 py-3 text-sm font-bold text-white shadow-xl"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        className="-my-2 -mr-2 grid size-11 shrink-0 place-items-center text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={() => setDismissedId(messageId)}
        aria-label="Cerrar aviso"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

function PasswordInput({
  id,
  name,
  error,
  describedBy,
}: {
  id: string;
  name: string;
  error?: string;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete="new-password"
        required
        minLength={10}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="pr-12!"
      />
      <button
        type="button"
        className="absolute top-1/2 right-0 grid size-11 -translate-y-1/2 place-items-center text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <Field label="Correo electrónico" htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Contraseña" htmlFor="password" required error={state.fieldErrors?.password?.[0]}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <SubmitButton pendingLabel="Entrando…" className="w-full">Entrar</SubmitButton>
      <Link className="text-center text-sm font-bold text-primary hover:underline" href="/recuperar-contrasena">
        He olvidado mi contraseña
      </Link>
      <p className="text-center text-sm text-muted">
        ¿Todavía no tienes cuenta?{" "}
        <Link className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4" href="/registro">
          Regístrate
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ compact = false }: { compact?: boolean }) {
  const [state, action] = useActionState(registerAction, initialActionState);
  return (
    <form action={action} className={compact ? "auth-register-compact grid gap-3 sm:gap-4" : "grid gap-5"} noValidate>
      <FormErrorToast
        message={state.status === "error" ? state.message : undefined}
        messageId={state.status === "error" ? state.messageId : undefined}
      />
      {state.status === "success" ? <FormMessage state={state} /> : null}
      <div className={compact ? "auth-register-fields grid items-start gap-x-5 gap-y-3 sm:grid-cols-2" : "grid items-start gap-5 sm:grid-cols-2"}>
        <Field label="Nombre y apellidos" htmlFor="fullName" required error={state.fieldErrors?.fullName?.[0]}>
          <Input id="fullName" name="fullName" type="text" autoComplete="name" required aria-invalid={Boolean(state.fieldErrors?.fullName?.[0])} />
        </Field>
        <Field label="Correo electrónico" htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.fieldErrors?.email?.[0])} />
        </Field>
        <Field label="Contraseña" htmlFor="password" required error={state.fieldErrors?.password?.[0]} hint="Mínimo 10 caracteres.">
          <PasswordInput
            id="password"
            name="password"
            error={state.fieldErrors?.password?.[0]}
            describedBy={state.fieldErrors?.password?.[0] ? "password-error" : "password-hint"}
          />
        </Field>
        <Field label="Repite la contraseña" htmlFor="confirmation" required error={state.fieldErrors?.confirmation?.[0]}>
          <PasswordInput
            id="confirmation"
            name="confirmation"
            error={state.fieldErrors?.confirmation?.[0]}
            describedBy={state.fieldErrors?.confirmation?.[0] ? "confirmation-error" : undefined}
          />
        </Field>
      </div>
      <p className="text-xs leading-5 text-muted">
        Al crear tu cuenta confirmas que has leído la{" "}
        <Link className="font-bold text-foreground underline decoration-primary underline-offset-4" href="/privacidad">
          política de privacidad
        </Link>.
      </p>
      <SubmitButton pendingLabel="Creando cuenta…" className="w-full">Crear cuenta</SubmitButton>
      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4" href="/login">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}

export function PasswordResetForm() {
  const [state, action] = useActionState(requestPasswordResetAction, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <Field label="Correo electrónico" htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <SubmitButton pendingLabel="Enviando…" className="w-full">Enviar enlace seguro</SubmitButton>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <Field label="Nueva contraseña" htmlFor="password" required error={state.fieldErrors?.password?.[0]} hint="Mínimo 10 caracteres.">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} />
      </Field>
      <Field label="Repite la contraseña" htmlFor="confirmation" required error={state.fieldErrors?.confirmation?.[0]}>
        <Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" required minLength={10} />
      </Field>
      <SubmitButton pendingLabel="Actualizando…" className="w-full">Guardar contraseña</SubmitButton>
    </form>
  );
}
