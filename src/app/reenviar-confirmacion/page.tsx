import type { Metadata } from "next";
import { ResendConfirmationForm } from "@/components/forms/auth-forms";
import { AuthShell } from "@/components/layout/auth-shell";

export const metadata: Metadata = {
  title: "Reenviar confirmación",
  robots: { index: false, follow: false },
};

export default function ResendConfirmationPage() {
  return (
    <AuthShell
      title="Confirma tu cuenta"
      description="Te enviaremos un enlace nuevo si ese correo tiene una cuenta pendiente de confirmar."
    >
      <ResendConfirmationForm />
    </AuthShell>
  );
}
