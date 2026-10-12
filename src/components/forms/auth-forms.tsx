"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  requestPasswordResetAction,
  updatePasswordAction,
} from "@/app/actions/auth";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

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
