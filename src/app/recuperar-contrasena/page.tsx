import type { Metadata } from "next";
import Link from "next/link";
import { PasswordResetForm } from "@/components/forms/auth-forms";
import { AuthShell } from "@/components/layout/auth-shell";

export const metadata: Metadata = { title: "Recuperar contraseña", robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Recuperar contraseña" description="Te enviaremos un enlace de un solo uso para elegir una contraseña nueva.">
      <PasswordResetForm />
      <Link href="/login" className="mt-6 block text-center text-sm font-bold text-primary hover:underline">Volver al acceso</Link>
    </AuthShell>
  );
}
