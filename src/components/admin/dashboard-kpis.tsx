"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronRight,
  ClipboardCheck,
  FileText,
  UserPlus,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export type DashboardKpiKey = "clients" | "leads" | "questionnaires" | "check-ins" | "fees";

export type DashboardKpiItem = {
  id: string;
  title: string;
  detail: string;
  date: string;
  href: string;
};

export type DashboardKpi = {
  key: DashboardKpiKey;
  label: string;
  value: number;
  viewAllHref: string;
  hasMore: boolean;
  emptyMessage: string;
  items: DashboardKpiItem[];
};

const icons: Record<DashboardKpiKey, LucideIcon> = {
  clients: UsersRound,
  leads: UserPlus,
  questionnaires: FileText,
  "check-ins": ClipboardCheck,
  fees: WalletCards,
};

export function DashboardKpis({ kpis }: { kpis: DashboardKpi[] }) {
  const [activeKey, setActiveKey] = useState<DashboardKpiKey | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const activeKpi = kpis.find((kpi) => kpi.key === activeKey) ?? null;

  useEffect(() => {
    if (!activeKpi) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveKey(null);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      lastTriggerRef.current?.focus();
    };
  }, [activeKpi]);

  function openKpi(kpi: DashboardKpi, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveKey(kpi.key);
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = icons[kpi.key];
          return (
            <button
              key={kpi.key}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={activeKey === kpi.key}
              onClick={(event) => openKpi(kpi, event.currentTarget)}
              className="group relative flex min-h-28 w-full items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-2xl font-black leading-none">{kpi.value}</span>
                <span className="mt-2 block text-sm font-bold leading-tight text-muted">{kpi.label}</span>
              </span>
              <ChevronRight className="absolute right-3 top-3 size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {activeKpi ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveKey(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative w-full max-w-2xl rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-2xl sm:p-7"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Cerrar resumen"
              onClick={() => setActiveKey(null)}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">Resumen rápido</p>
            <h2 id={titleId} className="font-display mt-2 pr-12 text-3xl font-black uppercase leading-none">
              {activeKpi.label}
            </h2>
            <p id={descriptionId} className="mt-3 text-sm leading-6 text-muted">
              Los 10 registros más recientes incluidos en este indicador.
            </p>

            {activeKpi.items.length > 0 ? (
              <ul className="mt-5 grid max-h-[min(55vh,32rem)] gap-2 overflow-y-auto pr-1">
                {activeKpi.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setActiveKey(null)}
                      className="group flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border px-4 py-3 transition hover:border-primary/40 hover:bg-primary-soft/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-bold text-foreground">{item.title}</span>
                        <span className="mt-1 block truncate text-sm text-muted">{item.detail}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-sm font-bold text-muted group-hover:text-primary">
                        {item.date}
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-[var(--radius-md)] bg-surface-muted p-5 text-sm text-muted">{activeKpi.emptyMessage}</p>
            )}

            {activeKpi.hasMore ? (
              <div className="mt-5 flex justify-end border-t border-border pt-5">
                <ButtonLink href={activeKpi.viewAllHref} onClick={() => setActiveKey(null)}>
                  Ver más
                </ButtonLink>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
