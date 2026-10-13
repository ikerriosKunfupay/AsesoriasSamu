import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileStatus, UserRole } from "@/lib/supabase/database.types";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string;
  avatarPath: string | null;
  role: UserRole;
  status: ProfileStatus;
  onboardingComplete: boolean;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_path, role, status, onboarding_complete")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) return null;

  return {
    id: profile.id,
    email: authData.user.email ?? "",
    fullName: profile.full_name || authData.user.email || "Usuario",
    avatarPath: profile.avatar_path,
    role: profile.role,
    status: profile.status,
    onboardingComplete: profile.onboarding_complete,
  };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status === "suspended" || user.status === "archived") redirect("/cuenta-inactiva");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/app/inicio");
  return user;
}

export async function requireClient() {
  const user = await requireUser();
  if (user.role !== "client") redirect("/admin");
  return user;
}

export async function requireCompletedClient() {
  const user = await requireClient();
  if (!user.onboardingComplete) redirect("/app/cuestionario");
  return user;
}
