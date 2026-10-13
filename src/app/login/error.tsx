"use client";

import { AuthShell } from "@/components/layout/auth-shell";
import { Button, ButtonLink } from "@/components/ui/button";

export default function LoginError() {
  return (
    <AuthShell
      title="Actualiza el acceso"
      description="La web ha cambiado mientras esta pestaña seguía abierta. Tu cuenta no se ha bloqueado."
    >
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-muted">
          Recarga el acceso para usar la versión actual y vuelve a introducir tus datos.
        </p>
        <Button
          className="public-action w-full"
          onClick={() => window.location.reload()}
        >
          Recargar acceso
        </Button>
        <ButtonLink className="w-full" href="/" variant="outline">
          Volver al inicio
        </ButtonLink>
      </div>
    </AuthShell>
  );
}
