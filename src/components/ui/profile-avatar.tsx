"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "TO";
}

export function ProfileAvatar({
  name,
  src,
  className,
  enlargeable = true,
}: {
  name: string;
  src?: string | null;
  className?: string;
  enlargeable?: boolean;
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const backgroundImage = src
    ? { backgroundImage: `url(${JSON.stringify(src).slice(1, -1)})` }
    : undefined;

  useEffect(() => {
    if (!viewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewerOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [viewerOpen]);

  function closeViewer() {
    setViewerOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  const avatarClassName = cn(
    "grid size-12 shrink-0 place-items-center rounded-full border-2 border-primary bg-surface-muted bg-cover bg-center text-sm font-black text-primary",
    className,
  );

  if (!src || !enlargeable) {
    return (
      <span
        role="img"
        aria-label={src ? `Foto de perfil de ${name}` : `Iniciales de ${name}`}
        className={avatarClassName}
        style={backgroundImage}
      >
        {src ? null : initials(name)}
      </span>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Ampliar foto de perfil de ${name}`}
        aria-haspopup="dialog"
        className={cn(
          avatarClassName,
          "cursor-zoom-in transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
        style={backgroundImage}
        onClick={() => setViewerOpen(true)}
      />
      {viewerOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-[min(90vw,42rem)]"
          >
            <h2 id={titleId} className="sr-only">Foto de perfil de {name}</h2>
            <button
              type="button"
              aria-label="Cerrar foto ampliada"
              onClick={closeViewer}
              className="absolute -top-3 -right-3 z-10 grid size-11 place-items-center rounded-full bg-surface text-foreground shadow-xl transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <div
              role="img"
              aria-label={`Foto ampliada de ${name}`}
              className="aspect-square w-full rounded-[var(--radius-lg)] border-2 border-white/70 bg-black bg-contain bg-center bg-no-repeat shadow-2xl"
              style={backgroundImage}
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
