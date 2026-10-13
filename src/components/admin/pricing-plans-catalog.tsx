"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Pencil, Table2, X } from "lucide-react";
import {
  ArchivePricingPlanButton,
  PricingPlanForm,
} from "@/components/forms/commercial-terms-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  billingCycleLabel,
  daysPerWeekLabel,
  serviceModalityLabel,
  type PricingPlanOption,
} from "@/lib/admin/commercial-terms";
import { formatMoney } from "@/lib/format";

type CatalogView = "table" | "list" | "gallery";

const VIEW_STORAGE_KEY = "team-ortega:pricing-plans-view";
const views: Array<{ value: CatalogView; label: string; icon: typeof Table2 }> = [
  { value: "table", label: "Tabla", icon: Table2 },
  { value: "list", label: "Lista", icon: List },
  { value: "gallery", label: "Galería", icon: LayoutGrid },
];

function PlanEditButton({ plan, onEdit }: { plan: PricingPlanOption; onEdit: (plan: PricingPlanOption) => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`Editar ${plan.name}, ${serviceModalityLabel(plan.serviceModality)}`}
      onClick={() => onEdit(plan)}
    >
      <Pencil className="size-4" aria-hidden="true" /> Editar
    </Button>
  );
}

function PlanMeta({ plan }: { plan: PricingPlanOption }) {
  return (
    <p className="text-sm text-muted">
      {serviceModalityLabel(plan.serviceModality)} · {daysPerWeekLabel(plan.daysPerWeek)} · {billingCycleLabel(plan.billingCycle)}
    </p>
  );
}

export function PricingPlansCatalog({ plans }: { plans: PricingPlanOption[] }) {
  const [view, setView] = useState<CatalogView>("table");
  const [editingPlan, setEditingPlan] = useState<PricingPlanOption | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
      if (storedView === "table" || storedView === "list" || storedView === "gallery") setView(storedView);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!editingPlan) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditingPlan(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [editingPlan]);

  function changeView(nextView: CatalogView) {
    setView(nextView);
    window.localStorage.setItem(VIEW_STORAGE_KEY, nextView);
  }

  return (
    <section aria-labelledby="pricing-plans-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="pricing-plans-title" className="text-xl font-black">Tarifas creadas</h2>
          <p className="text-sm text-muted">{plans.length} {plans.length === 1 ? "plantilla activa" : "plantillas activas"}</p>
        </div>
        <div className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface p-1" role="group" aria-label="Vista de tarifas">
          {views.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={view === value}
              onClick={() => changeView(value)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-[calc(var(--radius-md)-0.25rem)] px-3 text-sm font-bold transition-colors ${view === value ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground"}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-4">Nombre</th>
                  <th className="px-5 py-4">Modalidad</th>
                  <th className="px-5 py-4">Días</th>
                  <th className="px-5 py-4">Periodicidad</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-5 py-4 font-bold">{plan.name}</td>
                    <td className="px-5 py-4">{serviceModalityLabel(plan.serviceModality)}</td>
                    <td className="px-5 py-4">{daysPerWeekLabel(plan.daysPerWeek)}</td>
                    <td className="px-5 py-4">{billingCycleLabel(plan.billingCycle)}</td>
                    <td className="px-5 py-4 font-bold">{formatMoney(plan.defaultAmountEur)}</td>
                    <td className="px-5 py-4 text-right"><PlanEditButton plan={plan} onEdit={setEditingPlan} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {view === "list" ? (
        <div className="grid gap-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black">{plan.name}</h3>
                <PlanMeta plan={plan} />
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="text-lg font-black">{formatMoney(plan.defaultAmountEur)}</p>
                <PlanEditButton plan={plan} onEdit={setEditingPlan} />
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {view === "gallery" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex min-h-52 flex-col">
              <span className="mb-5 w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                {serviceModalityLabel(plan.serviceModality)}
              </span>
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <PlanMeta plan={plan} />
              <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                <p className="text-2xl font-black">{formatMoney(plan.defaultAmountEur)}</p>
                <PlanEditButton plan={plan} onEdit={setEditingPlan} />
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {editingPlan ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingPlan(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-plan-editor-title"
            className="relative w-full max-w-6xl rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              aria-label="Cerrar edición de tarifa"
              onClick={() => setEditingPlan(null)}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Editar tarifa</p>
            <h2 id="pricing-plan-editor-title" className="mb-6 mt-2 pr-12 text-3xl font-black">{editingPlan.name}</h2>
            <PricingPlanForm plan={editingPlan} />
            <div className="mt-5 border-t border-border pt-5">
              <ArchivePricingPlanButton pricingPlanId={editingPlan.id} planName={editingPlan.name} />
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
