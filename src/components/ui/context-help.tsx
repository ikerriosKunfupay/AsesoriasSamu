"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ContextHelp({
  label,
  description,
  className,
  align = "left",
}: {
  label: string;
  description: string;
  className?: string;
  align?: "left" | "right";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const suppressNextFocusRef = useRef(false);
  const tooltipId = useId();
  const isOpen = !isDismissed && (isHovered || hasFocus || isPinned);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePress = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsPinned(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsPinned(false);
      setIsHovered(false);
      setHasFocus(false);
      setIsDismissed(true);
      suppressNextFocusRef.current = true;
      triggerRef.current?.focus();
    };

    document.addEventListener("mousedown", closeOnOutsidePress);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePress);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <span
      ref={containerRef}
      className={cn("relative inline-flex shrink-0 align-middle", className)}
      onMouseEnter={() => {
        setIsDismissed(false);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => {
        setHasFocus(true);
        if (suppressNextFocusRef.current) {
          suppressNextFocusRef.current = false;
          return;
        }
        setIsDismissed(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          suppressNextFocusRef.current = false;
          setHasFocus(false);
          setIsDismissed(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Más información sobre ${label}`}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-primary focus-visible:bg-surface-muted focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDismissed(false);
          setIsPinned(true);
        }}
      >
        <span aria-hidden="true" className="grid size-5 place-items-center rounded-full border border-current text-xs font-black leading-none">
          ?
        </span>
      </button>
      {isOpen ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-[var(--radius-md)] border border-border bg-surface-inverse p-3 text-left text-xs font-medium leading-5 text-white shadow-xl",
            align === "right" ? "right-0" : "left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0",
          )}
        >
          <span className="block font-black text-primary">{label}</span>
          <span className="mt-1 block">{description}</span>
        </span>
      ) : null}
    </span>
  );
}
