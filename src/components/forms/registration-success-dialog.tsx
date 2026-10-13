"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const REGISTRATION_REDIRECT_DELAY_MS = 2500;

export function RegistrationSuccessDialog({
  message,
  onContinue,
  redirectDelay = REGISTRATION_REDIRECT_DELAY_MS,
}: {
  message: string;
  onContinue: () => void;
  redirectDelay?: number;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onContinue, redirectDelay);
    return () => window.clearTimeout(timeout);
  }, [onContinue, redirectDelay]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75 px-5 py-8" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-success-title"
        aria-describedby="registration-success-description"
        className="w-full max-w-md border-l-[6px] border-primary bg-[#f1efe9] p-6 shadow-2xl sm:p-8"
      >
        <CheckCircle2 className="text-success" size={40} aria-hidden="true" />
        <h2 id="registration-success-title" className="font-display mt-5 text-3xl font-black uppercase">
          Cuenta creada
        </h2>
        <p id="registration-success-description" className="mt-3 text-base leading-7 text-muted">
          {message}
        </p>
        <p className="mt-3 text-sm font-bold text-foreground">
          Te llevamos al acceso para que puedas iniciar sesión después de confirmar el correo.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Si no te llega, desde el acceso podrás reenviar la confirmación sin crear otra cuenta.
        </p>
        <Button className="public-action mt-6 w-full" onClick={onContinue}>
          Ir al login
        </Button>
      </section>
    </div>
  );
}
