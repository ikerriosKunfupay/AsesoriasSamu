import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/forms/auth-forms";
import { AuthShell } from "@/components/layout/auth-shell";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Crear cuenta", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "client") redirect(user.onboardingComplete ? "/app/inicio" : "/app/cuestionario");

  return (
    <AuthShell
      title="Crea tu cuenta"
      description="Regístrate como cliente. Te enviaremos un correo para confirmar tu cuenta antes de comenzar."
    >
      <RegisterForm />
    </AuthShell>
  );
}
