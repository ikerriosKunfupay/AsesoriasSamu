"use client";

import { Plus } from "lucide-react";

export function SectionFormSwitch({
  checked,
  label,
  ariaLabel,
  onChange,
}: {
  checked: boolean;
  label: string;
  ariaLabel: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className="inline-flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-sm font-bold"
    >
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-surface-muted"}`}
      >
        <span className={`absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
      <Plus className="size-4 text-primary" aria-hidden="true" />
      {label}
    </button>
  );
}
