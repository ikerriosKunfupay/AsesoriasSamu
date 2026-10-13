"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/forms/action-state";
import {
  fieldErrors,
  formValues,
  updateEmailSchema,
  updatePasswordSchema,
} from "@/lib/forms/schemas";
import {
  accountChangeCookieName,
  createAccountChangeToken,
  type AccountChangeKind,
  verifyAccountChangeToken,
} from "@/lib/auth/account-change-token";
import { requireCompletedClient } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function isAccountChangeKind(value: FormDataEntryValue | null): value is AccountChangeKind {
  return value === "email" || value === "password";
}

function changeDestination(kind: AccountChangeKind) {
  return kind === "email" ? "/app/ajustes/correo" : "/app/ajustes/contrasena";
}

async function hasVerifiedChange(kind: AccountChangeKind, userId: string) {
  const cookieStore = await cookies();
  return verifyAccountChangeToken(
    cookieStore.get(accountChangeCookieName(kind))?.value,
    kind,
    userId,
  );
}

export async function requestAccountChangeAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const kindValue = formData.get("kind");
  if (!isAccountChangeKind(kindValue)) {
    return { status: "error", message: "La solicitud no es válida." };
  }

  const user = await requireCompletedClient();
  const supabase = await createClient();
  const origin = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const proof = createAccountChangeToken(user.id, kindValue);
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", changeDestination(kindValue));
  callback.searchParams.set("settings_change", kindValue);
  callback.searchParams.set("proof", proof);

  const { error } = kindValue === "email"
    ? await supabase.auth.signInWithOtp({
        email: user.email,
        options: { emailRedirectTo: callback.toString(), shouldCreateUser: false },
      })
    : await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: callback.toString(),
      });

  if (error) {
    return {
      status: "error",
      message: "No se pudo enviar el correo de verificación. Inténtalo de nuevo en unos minutos.",
    };
  }

  return {
    status: "success",
    message: kindValue === "email"
      ? `Hemos enviado un enlace de verificación a ${user.email}. Ábrelo para indicar tu nuevo correo.`
      : `Hemos enviado un enlace seguro a ${user.email}. Ábrelo para elegir tu nueva contraseña.`,
  };
}

export async function changeEmailAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireCompletedClient();
  if (!(await hasVerifiedChange("email", user.id))) {
    return { status: "error", message: "La verificación ha caducado. Solicita un enlace nuevo." };
  }

  const parsed = updateEmailSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa el nuevo correo.", fieldErrors: fieldErrors(parsed.error) };
  }
  if (parsed.data.newEmail.toLowerCase() === user.email.toLowerCase()) {
    return {
      status: "error",
      message: "El nuevo correo debe ser distinto del actual.",
      fieldErrors: { newEmail: ["Escribe una dirección diferente."] },
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    email: parsed.data.newEmail,
    email_confirm: true,
  });
  if (error) {
    return {
      status: "error",
      message: "No se pudo actualizar el correo. Comprueba que no esté en uso.",
      fieldErrors: { newEmail: ["Prueba con otra dirección o inténtalo más tarde."] },
    };
  }

  (await cookies()).delete(accountChangeCookieName("email"));
  revalidatePath("/app", "layout");
  revalidatePath("/app/ajustes");
  revalidatePath(`/admin/clientes/${user.id}`);
  redirect("/app/ajustes?email=actualizado");
}

export async function changePasswordAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireCompletedClient();
  if (!(await hasVerifiedChange("password", user.id))) {
    return { status: "error", message: "La verificación ha caducado. Solicita un enlace nuevo." };
  }

  const parsed = updatePasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa las contraseñas.", fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { status: "error", message: "No se pudo actualizar la contraseña. Solicita un enlace nuevo." };
  }

  (await cookies()).delete(accountChangeCookieName("password"));
  redirect("/app/ajustes?password=actualizada");
}
