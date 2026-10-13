"use client";

import { KeyRound, Mail } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { requestAccountChangeAction } from "@/app/actions/account-security";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { initialActionState, type ActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { PhonePrefixSelect } from "./phone-prefix-select";
import { formatPhoneValue, splitPhoneValue } from "@/lib/forms/phone";
import { SubmitButton } from "./submit-button";

export function ProfileSettingsForm({
  initial,
  avatarUrl,
  notice,
  noticeTone = "success",
}: {
  initial: { fullName: string; phone: string; email: string };
  avatarUrl?: string | null;
  notice?: string;
  noticeTone?: "success" | "error";
}) {
  const [profileState, profileAction] = useActionState(updateProfileAction, initialActionState);
  const [securityState, securityAction] = useActionState(requestAccountChangeAction, initialActionState);
  const [{ prefix: initialPhonePrefix, phoneNumber: initialPhoneNumber }] = useState(() => splitPhoneValue(initial.phone));
  const [phonePrefix, setPhonePrefix] = useState<string>(initialPhonePrefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const normalizedPhone = formatPhoneValue(phonePrefix, phoneNumber);
  const noticeState = useMemo<ActionState>(() => (
    notice
      ? { status: noticeTone === "error" ? "error" : "success", message: notice }
      : initialActionState
  ), [notice, noticeTone]);

  return (
    <div className="grid max-w-3xl gap-8">
      <FormMessage state={noticeState} />
      <form action={profileAction} className="grid gap-6" noValidate>
        <FormMessage state={profileState} />
        <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-surface-muted p-5 sm:flex-row sm:items-center">
          <ProfileAvatar name={initial.fullName} src={avatarUrl} className="size-24 text-2xl" />
          <div className="grid min-w-0 flex-1 gap-3">
            <Field
              label="Foto de perfil"
              htmlFor="avatar"
              hint="JPG, PNG o WebP. Máximo 2 MB. Pulsa la foto para ampliarla."
              error={profileState.fieldErrors?.avatar?.[0]}
            >
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="h-auto cursor-pointer py-2 file:mr-3 file:min-h-9 file:cursor-pointer file:rounded-[var(--radius-sm)] file:border-0 file:bg-primary file:px-3 file:font-bold file:text-white"
                aria-invalid={Boolean(profileState.fieldErrors?.avatar?.[0]) || undefined}
                aria-describedby={profileState.fieldErrors?.avatar?.[0] ? "avatar-error" : "avatar-hint"}
              />
            </Field>
            {avatarUrl ? (
              <Button
                type="submit"
                name="intent"
                value="removeAvatar"
                variant="outline"
                size="sm"
                className="w-fit text-danger hover:border-danger hover:text-danger"
              >
                Quitar foto
              </Button>
            ) : null}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre y apellidos" htmlFor="fullName" required error={profileState.fieldErrors?.fullName?.[0]}>
            <Input id="fullName" name="fullName" type="text" autoComplete="name" defaultValue={initial.fullName} required />
          </Field>
          <Field label="Teléfono" htmlFor="profilePhoneNumber" error={profileState.fieldErrors?.phone?.[0]}>
            <input type="hidden" name="phone" value={normalizedPhone} />
            <div className="flex min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface focus-within:border-primary">
              <PhonePrefixSelect value={phonePrefix} onChange={setPhonePrefix} />
              <input
                id="profilePhoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="600 000 000"
                className="min-h-12 min-w-0 flex-1 rounded-r-[var(--radius-md)] border-0 bg-transparent px-3.5 text-base text-foreground placeholder:text-muted/70"
              />
            </div>
          </Field>
        </div>
        <SubmitButton pendingLabel="Guardando…" className="w-full sm:w-fit">
          Guardar ajustes
        </SubmitButton>
      </form>

      <section className="grid gap-5 border-t border-border pt-8" aria-labelledby="account-security-title">
        <div>
          <h2 id="account-security-title" className="font-display text-2xl font-black uppercase">
            Seguridad de la cuenta
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Los cambios sensibles se autorizan primero mediante un enlace enviado a tu correo actual.
          </p>
        </div>
        <FormMessage state={securityState} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid content-between gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-muted p-5">
            <div>
              <Mail className="size-6 text-primary" aria-hidden="true" />
              <div className="mt-3">
                <Field label="Correo electrónico" htmlFor="currentEmail">
                  <Input id="currentEmail" type="email" value={initial.email} readOnly aria-readonly="true" />
                </Field>
              </div>
            </div>
            <form action={securityAction}>
              <input type="hidden" name="kind" value="email" />
              <SubmitButton pendingLabel="Enviando…" className="w-full">
                Cambiar correo
              </SubmitButton>
            </form>
          </div>
          <div className="grid content-between gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-muted p-5">
            <div>
              <KeyRound className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-bold">Contraseña</h3>
              <p className="mt-1 text-sm leading-5 text-muted">Recibe un enlace seguro antes de elegir una nueva.</p>
            </div>
            <form action={securityAction}>
              <input type="hidden" name="kind" value="password" />
              <SubmitButton pendingLabel="Enviando…" className="w-full">
                Cambiar contraseña
              </SubmitButton>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
