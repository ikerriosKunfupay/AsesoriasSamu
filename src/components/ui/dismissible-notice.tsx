"use client";

import { X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DismissibleNotice({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-lg)] bg-primary-soft py-4 pr-14 pl-4 text-sm leading-6 text-primary",
        className,
      )}
    >
      {children}
      <button
        type="button"
        className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setVisible(false)}
        aria-label="Cerrar aviso de privacidad"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
