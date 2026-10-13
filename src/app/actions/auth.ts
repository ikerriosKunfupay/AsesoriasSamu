"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/forms/action-state";
import {
  emailSchema,
  fieldErrors,
  formValues,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/forms/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const INITIAL_ADMIN_EMAIL = "samprox77@gmail.com";

export async function loginAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos.", fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { status: "error", message: "El correo o la contraseña no son correctos." };
  }

  if (data.user.email?.toLowerCase() === INITIAL_ADMIN_EMAIL) {
    const admin = createAdminClient();
    const { error: promotionError } = await admin
      .from("profiles")
      .update({ role: "admin", status: "active" })
      .eq("id", data.user.id);

    if (promotionError) {
      await supabase.auth.signOut();
      return { status: "error", message: "No se pudo preparar el acceso de administración." };
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status, onboarding_complete")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return { status: "error", message: "La cuenta todavía no está preparada. Contacta con Team Ortega." };
  }

  if (profile.status === "suspended" || profile.status === "archived") redirect("/cuenta-inactiva");
  if (profile.role === "admin") redirect("/admin");
  redirect(profile.onboarding_complete ? "/app/inicio" : "/app/cuestionario");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function registerAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Revisa los campos marcados en rojo.",
      messageId: crypto.randomUUID(),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${origin}/auth/callback?next=/app/cuestionario`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: "No se pudo crear la cuenta. Revisa los datos o prueba con otro correo.",
      messageId: crypto.randomUUID(),
    };
  }

  if (data.session) redirect("/app/cuestionario");

  return {
    status: "success",
    message: "Cuenta creada. Revisa tu correo para confirmarla y comenzar el cuestionario.",
  };
}

export async function requestPasswordResetAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa el correo.", fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/auth/actualizar-contrasena`,
  });

  return {
    status: "success",
    message: "Si existe una cuenta con ese correo, recibirás un enlace para cambiar la contraseña.",
  };
}

export async function updatePasswordAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa las contraseñas.", fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: "No se pudo actualizar la contraseña. Pide un enlace nuevo." };
  redirect("/login?password=updated");
}
