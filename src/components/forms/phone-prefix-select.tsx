"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const PHONE_PREFIXES = [
  { value: "+34", label: "ES +34" },
  { value: "+351", label: "PT +351" },
  { value: "+33", label: "FR +33" },
  { value: "+44", label: "UK +44" },
  { value: "+49", label: "DE +49" },
  { value: "+39", label: "IT +39" },
] as const;

const DEFAULT_PHONE_PREFIX = PHONE_PREFIXES[0].value;

export function splitPhoneValue(value: string) {
  const normalizedValue = value.trim();
  const matchingPrefix = [...PHONE_PREFIXES]
    .sort((left, right) => right.value.length - left.value.length)
    .find(({ value: prefix }) => (
      normalizedValue === prefix
      || normalizedValue.startsWith(`${prefix} `)
      || normalizedValue.startsWith(prefix)
    ));

  if (!matchingPrefix) {
    return { prefix: DEFAULT_PHONE_PREFIX, phoneNumber: normalizedValue };
  }

  return {
    prefix: matchingPrefix.value,
    phoneNumber: normalizedValue.slice(matchingPrefix.value.length).trim(),
  };
}

export function formatPhoneValue(prefix: string, phoneNumber: string) {
  const normalizedNumber = phoneNumber.trim();
  if (!normalizedNumber) return "";
  if (normalizedNumber.startsWith("+")) return normalizedNumber;
  return `${prefix} ${normalizedNumber}`;
}

export function PhonePrefixSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = PHONE_PREFIXES.findIndex((prefix) => prefix.value === value);
  const selectedPrefix = PHONE_PREFIXES[selectedIndex] ?? PHONE_PREFIXES[0];

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  const openMenu = (focusIndex = Math.max(selectedIndex, 0)) => {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[focusIndex]?.focus());
  };

  const selectPrefix = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + direction + PHONE_PREFIXES.length) % PHONE_PREFIXES.length;
      optionRefs.current[nextIndex]?.focus();
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionRefs.current[event.key === "Home" ? 0 : PHONE_PREFIXES.length - 1]?.focus();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-[7.25rem] shrink-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Prefijo telefónico, ${selectedPrefix.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className="flex min-h-12 w-full items-center justify-between border-r border-border-strong px-3 text-left text-sm font-black text-foreground"
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(event.key === "ArrowDown" ? Math.max(selectedIndex, 0) : Math.max(selectedIndex - 1, 0));
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <span>{selectedPrefix.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted"}`}
        />
      </button>
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Prefijos telefónicos"
          className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-40 border-t-4 border-primary bg-surface-inverse py-1 text-white shadow-2xl [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)]"
        >
          {PHONE_PREFIXES.map((prefix, index) => {
            const isSelected = prefix.value === value;
            return (
              <button
                key={prefix.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex min-h-11 w-full items-center justify-between px-4 text-left text-sm font-black transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none ${isSelected ? "text-primary" : "text-white"}`}
                onClick={() => selectPrefix(prefix.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span>{prefix.label}</span>
                {isSelected ? <Check aria-hidden="true" className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
