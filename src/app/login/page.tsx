import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/auth-forms";
import { AuthShell } from "@/components/layout/auth-shell";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Acceso", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "client") redirect(user.onboardingComplete ? "/app/inicio" : "/app/cuestionario");

  return (
    <AuthShell title="Acceso privado" description="Entra con tu cuenta de Team Ortega.">
      <LoginForm />
    </AuthShell>
  );
}
