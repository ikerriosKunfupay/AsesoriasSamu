"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useCallback } from "react";
import {
  loginAction,
  registerAction,
  requestPasswordResetAction,
  updatePasswordAction,
} from "@/app/actions/auth";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import { FormErrorToast } from "./form-error-toast";
import { FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";
import { RegistrationSuccessDialog } from "./registration-success-dialog";
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
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          error={state.fieldErrors?.password?.[0]}
          describedBy={state.fieldErrors?.password?.[0] ? "password-error" : undefined}
        />
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
  const router = useRouter();
  const goToLogin = useCallback(() => router.replace("/login"), [router]);

  return (
    <form action={action} className={compact ? "auth-register-compact grid gap-3 sm:gap-4" : "grid gap-5"} noValidate>
      <FormErrorToast
        message={state.status === "error" ? state.message : undefined}
        messageId={state.status === "error" ? state.messageId : undefined}
      />
      {state.status === "success" && state.message ? (
        <RegistrationSuccessDialog message={state.message} onContinue={goToLogin} />
      ) : null}
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
            minLength={10}
            error={state.fieldErrors?.password?.[0]}
            describedBy={state.fieldErrors?.password?.[0] ? "password-error" : "password-hint"}
          />
        </Field>
        <Field label="Repite la contraseña" htmlFor="confirmation" required error={state.fieldErrors?.confirmation?.[0]}>
          <PasswordInput
            id="confirmation"
            name="confirmation"
            minLength={10}
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
