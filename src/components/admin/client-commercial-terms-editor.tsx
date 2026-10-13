"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ClientCommercialTermsForm } from "@/components/forms/commercial-terms-forms";
import { Button } from "@/components/ui/button";
import type {
  ClientCommercialTermsValue,
  PricingPlanOption,
} from "@/lib/admin/commercial-terms";

export function ClientCommercialTermsEditor({
  clientId,
  clientName,
  pricingPlans,
  initialTerms,
}: {
  clientId: string;
  clientName: string;
  pricingPlans: PricingPlanOption[];
  initialTerms: ClientCommercialTermsValue;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  return (
    <>
      <Button ref={triggerRef} type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        Condiciones
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`commercial-terms-${clientId}`}
            className="relative w-full max-w-2xl rounded-[var(--radius-lg)] bg-surface p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              aria-label="Cerrar condiciones comerciales"
              onClick={close}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Cliente</p>
            <h2 id={`commercial-terms-${clientId}`} className="mt-2 pr-12 text-2xl font-black">
              Condiciones de {clientName}
            </h2>
            <p className="mb-6 mt-2 text-sm text-muted">
              La modalidad, tarifa y precio son datos internos; no se realiza ningún cobro desde la aplicación.
            </p>
            <ClientCommercialTermsForm
              clientId={clientId}
              pricingPlans={pricingPlans}
              initialTerms={initialTerms}
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
