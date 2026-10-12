import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/forms/auth-forms";
import { AuthShell } from "@/components/layout/auth-shell";

export const metadata: Metadata = { title: "Crear contraseña", robots: { index: false, follow: false } };

export default function UpdatePasswordPage() {
  return (
    <AuthShell title="Crea tu contraseña" description="Usa una contraseña única que no utilices en otros servicios.">
      <UpdatePasswordForm />
    </AuthShell>
  );
}
