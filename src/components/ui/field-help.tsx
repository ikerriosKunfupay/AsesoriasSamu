"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

export type FieldHelpContent = {
  description: string;
  examples: readonly string[];
  privacyNote?: string;
};

export function FieldHelp({
  label,
  content,
}: {
  label: string;
  content: FieldHelpContent;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const closeHelp = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Más información sobre ${label}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-primary"
        onClick={() => setIsOpen(true)}
      >
        <span
          aria-hidden="true"
          className="grid size-5 place-items-center rounded-full border border-current text-xs font-black leading-none"
        >
          ?
        </span>
      </button>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeHelp();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative w-full max-w-lg border-l-[6px] border-primary bg-surface p-6 shadow-2xl sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Cerrar ayuda"
              onClick={closeHelp}
              className="absolute top-3 right-3 grid size-11 place-items-center text-muted transition-colors hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <p className="pr-12 text-xs font-black tracking-[0.16em] text-primary uppercase">
              Cómo completar este campo
            </p>
            <h2 id={titleId} className="font-display mt-3 pr-12 text-2xl font-black leading-tight uppercase sm:text-3xl">
              {label}
            </h2>
            <p id={descriptionId} className="mt-4 text-base leading-7 text-muted">
              {content.description}
            </p>
            <div className="mt-5 border-l-4 border-primary bg-primary-soft p-4 text-sm font-bold leading-6 text-foreground">
              Cuanto más concreta y desarrollada sea tu respuesta, mejor podrá Team Ortega entender tu día a día y adaptar el plan a ti.
            </div>
            <h3 className="mt-6 text-sm font-black tracking-[0.08em] uppercase">Puedes incluir</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              {content.examples.map((example) => (
                <li key={example} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{example}</span>
                </li>
              ))}
            </ul>
            {content.privacyNote ? (
              <p className="mt-5 border-t border-border pt-4 text-sm font-bold leading-6 text-primary">
                {content.privacyNote}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
