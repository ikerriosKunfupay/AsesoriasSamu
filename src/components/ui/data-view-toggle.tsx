"use client";

import { LayoutGrid, List, Table2 } from "lucide-react";
import { useEffect, useState } from "react";

export type DataView = "table" | "list" | "gallery";

const views: Array<{ value: DataView; label: string; icon: typeof Table2 }> = [
  { value: "table", label: "Tabla", icon: Table2 },
  { value: "list", label: "Lista", icon: List },
  { value: "gallery", label: "Galería", icon: LayoutGrid },
];

export function usePersistedDataView(storageKey: string) {
  const [view, setView] = useState<DataView>("table");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "table" || stored === "list" || stored === "gallery") setView(stored);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);

  const changeView = (nextView: DataView) => {
    setView(nextView);
    window.localStorage.setItem(storageKey, nextView);
  };

  return [view, changeView] as const;
}

export function DataViewToggle({
  view,
  onChange,
  label,
}: {
  view: DataView;
  onChange: (view: DataView) => void;
  label: string;
}) {
  return (
    <div className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface p-1" role="group" aria-label={label}>
      {views.map(({ value, label: optionLabel, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={optionLabel}
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={`inline-flex min-h-10 items-center gap-2 rounded-[calc(var(--radius-md)-0.25rem)] px-3 text-sm font-bold transition-colors ${view === value ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground"}`}
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{optionLabel}</span>
        </button>
      ))}
    </div>
  );
}
