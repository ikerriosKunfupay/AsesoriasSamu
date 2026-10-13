"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function ProfileSettingsForm({
  initial,
  avatarUrl,
}: {
  initial: { fullName: string; phone: string; email: string };
  avatarUrl?: string | null;
}) {
  const [state, action] = useActionState(updateProfileAction, initialActionState);

  return (
    <form action={action} className="grid max-w-3xl gap-6" noValidate>
      <FormMessage state={state} />
      <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-surface-muted p-5 sm:flex-row sm:items-center">
        <ProfileAvatar name={initial.fullName} src={avatarUrl} className="size-24 text-2xl" />
        <Field
          label="Foto de perfil"
          htmlFor="avatar"
          hint="JPG, PNG o WebP. Máximo 2 MB."
          error={state.fieldErrors?.avatar?.[0]}
        >
          <Input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="h-auto cursor-pointer py-2 file:mr-3 file:min-h-9 file:cursor-pointer file:rounded-[var(--radius-sm)] file:border-0 file:bg-primary file:px-3 file:font-bold file:text-white"
            aria-invalid={Boolean(state.fieldErrors?.avatar?.[0]) || undefined}
            aria-describedby={state.fieldErrors?.avatar?.[0] ? "avatar-error" : "avatar-hint"}
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre y apellidos" htmlFor="fullName" required error={state.fieldErrors?.fullName?.[0]}>
          <Input id="fullName" name="fullName" type="text" autoComplete="name" defaultValue={initial.fullName} required />
        </Field>
        <Field label="Teléfono" htmlFor="phone" error={state.fieldErrors?.phone?.[0]}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={initial.phone} />
        </Field>
      </div>
      <Field
        label="Correo electrónico"
        htmlFor="email"
        required
        hint="Si lo cambias, tendrás que confirmar la nueva dirección."
        error={state.fieldErrors?.email?.[0]}
      >
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={initial.email} required />
      </Field>
      <SubmitButton pendingLabel="Guardando…" className="w-full sm:w-fit">
        Guardar ajustes
      </SubmitButton>
    </form>
  );
}
