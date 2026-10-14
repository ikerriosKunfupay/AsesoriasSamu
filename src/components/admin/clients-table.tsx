"use client";

import { useActionState, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, MoreHorizontal, Tags, X } from "lucide-react";
import { saveClientCommercialQuickUpdateAction } from "@/app/actions/admin";
import { ClientCommercialTermsEditor } from "@/components/admin/client-commercial-terms-editor";
import {
  ClientAdminNotesForm,
  ClientStatusSwitch,
} from "@/components/forms/admin-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataViewToggle, usePersistedDataView, type DataView } from "@/components/ui/data-view-toggle";
import { Input } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import {
  billingCycleLabel,
  pricingPlanDetailsLabel,
  serviceModalityOptions,
  type PricingPlanOption,
} from "@/lib/admin/commercial-terms";
import {
  filterAndSortClients,
  emptyClientTableFilters,
  nextClientTableSort,
  type ClientTableFilters,
  type ClientTableItem,
  type ClientTableSort,
  type ClientTableSortKey,
} from "@/lib/admin/client-table";
import { formatMoney } from "@/lib/format";
import { initialActionState } from "@/lib/forms/action-state";

const columnLabels: Record<ClientTableSortKey, string> = {
  name: "Cliente",
  status: "Alta / baja",
  questionnaire: "Cuestionario",
  modality: "Modalidad",
  pricingPlan: "Tarifa",
  amount: "Precio",
  notes: "Notas internas",
};

function SortableHeader({
  column,
  sort,
  onSort,
}: {
  column: ClientTableSortKey;
  sort: ClientTableSort;
  onSort: (column: ClientTableSortKey) => void;
}) {
  const direction = sort?.key === column ? sort.direction : null;
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;
  const nextState = direction === "asc" ? "descendente" : direction === "desc" ? "original" : "ascendente";

  return (
    <th aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}>
      <button
        type="button"
        className="inline-flex min-h-10 items-center gap-2 text-left font-black hover:text-primary"
        aria-label={`Ordenar ${columnLabels[column]} en orden ${nextState}`}
        onClick={() => onSort(column)}
      >
        {columnLabels[column]}
        <Icon aria-hidden="true" className="size-4" />
      </button>
    </th>
  );
}

function QuickCommercialSelect({
  clientId,
  field,
  value,
  label,
  options,
  className,
}: {
  clientId: string;
  field: "modality" | "pricingPlanId";
  value: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const [state, action, pending] = useActionState(saveClientCommercialQuickUpdateAction, initialActionState);

  return (
    <form ref={formRef} action={action} className="grid gap-1">
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={selectedValue} />
      <InternalSelect
        id={`quick-${field}-${clientId}`}
        value={selectedValue}
        options={options}
        ariaLabel={label}
        invalid={state.status === "error"}
        disabled={pending}
        menuPlacement="top"
        menuPortal
        className={`min-h-10 py-2 pl-2.5 pr-4 text-sm font-bold disabled:opacity-60 ${className ?? ""}`}
        onValueChange={(nextValue) => {
          if (pending) return;
          setSelectedValue(nextValue);
          window.requestAnimationFrame(() => formRef.current?.requestSubmit());
        }}
      />
      <span className="sr-only" role={state.status === "error" ? "alert" : "status"} aria-live="polite">
        {pending ? "Guardando…" : state.message}
      </span>
    </form>
  );
}

function ClientRowActions({
  client,
  pricingPlans,
  detailHref,
}: {
  client: ClientTableItem;
  pricingPlans: PricingPlanOption[];
  detailHref: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportPadding = 16;
    const width = Math.min(256, window.innerWidth - viewportPadding * 2);
    const left = Math.min(
      Math.max(rect.right - width, viewportPadding),
      window.innerWidth - width - viewportPadding,
    );
    setMenuStyle({ bottom: window.innerHeight - rect.top + 8, left, width });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    updateMenuPosition();
    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Más opciones para ${client.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="grid size-10 place-items-center rounded-[var(--radius-md)] border border-border-strong bg-surface transition hover:bg-surface-muted"
        onClick={() => {
          updateMenuPosition();
          setIsOpen((open) => !open);
        }}
      >
        <MoreHorizontal aria-hidden="true" className="size-5" />
      </button>
      {isOpen ? createPortal(
        <div ref={menuRef} role="menu" style={menuStyle} className="fixed z-[60] grid gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-2 shadow-xl">
          <ClientCommercialTermsEditor
            clientId={client.id}
            clientName={client.name}
            pricingPlans={pricingPlans}
            initialTerms={client.modality && client.agreedAmountEur != null ? {
              modality: client.modality,
              pricingPlanId: client.pricingPlanId,
              agreedAmountEur: client.agreedAmountEur,
            } : null}
            menuTrigger
          />
          <Link
            href="/admin/tarifas"
            role="menuitem"
            className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-bold transition hover:bg-surface-muted"
          >
            <Tags aria-hidden="true" className="size-4" />
            Gestionar tarifas
          </Link>
          <Link
            href={detailHref}
            role="menuitem"
            className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] px-3 text-sm font-bold transition hover:bg-surface-muted"
          >
            Ver ficha
          </Link>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}

function ClientsAlternativeView({
  clients,
  pricingPlans,
  view,
}: {
  clients: ClientTableItem[];
  pricingPlans: PricingPlanOption[];
  view: Exclude<DataView, "table">;
}) {
  return (
    <div className={view === "gallery" ? "grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3 p-4"}>
      {clients.map((client) => {
        const detailHref = getClientDetailHref(client.id, "/admin/clientes");
        return (
          <article key={client.id} className={`rounded-[var(--radius-md)] border border-border p-4 ${view === "gallery" ? "flex min-h-96 flex-col" : "grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]"}`}>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link className="block truncate text-lg font-black hover:text-primary" href={detailHref}>{client.name}</Link>
                  <p className="mt-1 text-sm text-muted">Cuestionario: {client.onboardingComplete ? "Completado" : "Pendiente"}</p>
                </div>
                <ClientStatusSwitch clientId={client.id} clientName={client.name} status={client.status} />
              </div>
              <div className={`mt-4 grid gap-3 ${view === "list" ? "sm:grid-cols-3" : ""}`}>
                <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-muted">Modalidad
                  <QuickCommercialSelect
                    key={`alt-modality-${client.modality ?? "unassigned"}`}
                    clientId={client.id}
                    field="modality"
                    value={client.modality ?? ""}
                    label={`Modalidad de ${client.name}`}
                    className="w-full"
                    options={client.modality ? serviceModalityOptions : [{ value: "", label: "Sin asignar" }, ...serviceModalityOptions]}
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-muted">Tarifa
                  <QuickCommercialSelect
                    key={`alt-pricing-${client.pricingPlanId ?? "unassigned"}`}
                    clientId={client.id}
                    field="pricingPlanId"
                    value={client.pricingPlanId ?? ""}
                    label={`Tarifa de ${client.name}`}
                    className="w-full"
                    options={[
                      { value: "", label: "Sin asignar" },
                      ...pricingPlans.filter((plan) => plan.active || plan.id === client.pricingPlanId).map((plan) => ({ value: plan.id, label: `${plan.name} · ${pricingPlanDetailsLabel(plan)} · ${billingCycleLabel(plan.billingCycle)}` })),
                    ]}
                  />
                </label>
                <div><p className="text-xs font-black uppercase tracking-wide text-muted">Precio</p><p className="mt-2 font-black">{client.agreedAmountEur == null ? "—" : formatMoney(client.agreedAmountEur)}</p></div>
              </div>
              <div className="mt-4"><ClientAdminNotesForm clientId={client.id} initialNotes={client.notes} compact /></div>
            </div>
            <div className={`flex justify-end ${view === "gallery" ? "mt-auto pt-5" : "items-start"}`}><ClientRowActions client={client} pricingPlans={pricingPlans} detailHref={detailHref} /></div>
          </article>
        );
      })}
    </div>
  );
}

export function ClientsTable({
  clients,
  pricingPlans,
}: {
  clients: ClientTableItem[];
  pricingPlans: PricingPlanOption[];
}) {
  const [filters, setFilters] = useState<ClientTableFilters>({ ...emptyClientTableFilters });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<ClientTableSort>(null);
  const [view, setView] = usePersistedDataView("team-ortega:clients-view");
  const visibleClients = useMemo(
    () => filterAndSortClients(clients, filters, sort),
    [clients, filters, sort],
  );
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => (
    key === "status" || key === "questionnaire" || key === "modality" || key === "pricingPlanId"
      ? value !== "all"
      : String(value).trim() !== ""
  )).length;

  function updateFilter<Key extends keyof ClientTableFilters>(key: Key, value: ClientTableFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetTable() {
    setFilters({ ...emptyClientTableFilters });
    setSort(null);
  }

  return (
    <Card className="p-0">
      <div className="border-b border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <DataViewToggle view={view} onChange={setView} label="Vista de clientes" />
          <Button type="button" variant="outline" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} aria-controls="client-table-filters">
            <Filter aria-hidden="true" className="size-4" />
            Filtros
            {activeFilterCount ? <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{activeFilterCount}</span> : null}
          </Button>
          {activeFilterCount || sort ? (
          <Button type="button" variant="ghost" onClick={resetTable}>
            <X aria-hidden="true" className="size-4" />
            Restablecer
          </Button>
          ) : null}
          <p className="ml-auto shrink-0 text-sm font-bold text-muted" aria-live="polite">
            {visibleClients.length} de {clients.length}
          </p>
        </div>
        {filtersOpen ? (
          <div id="client-table-filters" className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Cliente
              <Input value={filters.name} onChange={(event) => updateFilter("name", event.target.value)} placeholder="Nombre…" className="min-h-10 text-sm normal-case tracking-normal text-foreground" />
            </label>
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Alta / baja
              <InternalSelect
                id="client-filter-status"
                value={filters.status}
                ariaLabel="Filtrar por alta o baja"
                className="min-h-10 text-sm normal-case tracking-normal"
                options={[
                  { value: "all", label: "Todos" },
                  { value: "active", label: "Activos" },
                  { value: "archived", label: "Inactivos" },
                ]}
                onValueChange={(value) => updateFilter("status", value as ClientTableFilters["status"])}
              />
            </label>
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Cuestionario
              <InternalSelect
                id="client-filter-questionnaire"
                value={filters.questionnaire}
                ariaLabel="Filtrar por cuestionario"
                className="min-h-10 text-sm normal-case tracking-normal"
                options={[
                  { value: "all", label: "Todos" },
                  { value: "complete", label: "Completado" },
                  { value: "pending", label: "Pendiente" },
                ]}
                onValueChange={(value) => updateFilter("questionnaire", value as ClientTableFilters["questionnaire"])}
              />
            </label>
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Modalidad
              <InternalSelect
                id="client-filter-modality"
                value={filters.modality}
                ariaLabel="Filtrar por modalidad"
                className="min-h-10 text-sm normal-case tracking-normal"
                options={[
                  { value: "all", label: "Todas" },
                  ...serviceModalityOptions,
                  { value: "unassigned", label: "Sin asignar" },
                ]}
                onValueChange={(value) => updateFilter("modality", value as ClientTableFilters["modality"])}
              />
            </label>
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Tarifa
              <InternalSelect
                id="client-filter-pricing-plan"
                value={filters.pricingPlanId}
                ariaLabel="Filtrar por tarifa"
                className="min-h-10 text-sm normal-case tracking-normal"
                options={[
                  { value: "all", label: "Todas" },
                  ...pricingPlans.map((plan) => ({ value: plan.id, label: plan.name })),
                  { value: "unassigned", label: "Sin asignar" },
                ]}
                onValueChange={(value) => updateFilter("pricingPlanId", value)}
              />
            </label>
            <fieldset className="grid gap-1.5">
              <legend className="text-xs font-black uppercase tracking-wide text-muted">Precio (€)</legend>
              <div className="grid grid-cols-2 gap-2">
                <Input value={filters.minAmount} onChange={(event) => updateFilter("minAmount", event.target.value.replace(/[^0-9.,]/g, ""))} inputMode="decimal" placeholder="Mín." aria-label="Precio mínimo" className="min-h-10 text-sm" />
                <Input value={filters.maxAmount} onChange={(event) => updateFilter("maxAmount", event.target.value.replace(/[^0-9.,]/g, ""))} inputMode="decimal" placeholder="Máx." aria-label="Precio máximo" className="min-h-10 text-sm" />
              </div>
            </fieldset>
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted sm:col-span-2">
              Notas internas
              <Input value={filters.notes} onChange={(event) => updateFilter("notes", event.target.value)} placeholder="Contenido de la nota…" className="min-h-10 text-sm normal-case tracking-normal text-foreground" />
            </label>
          </div>
        ) : null}
      </div>
      {view === "table" ? <div className="clients-table-scroll overflow-x-auto">
        <table className="data-table clients-table">
          <thead>
            <tr>
              <SortableHeader column="name" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <SortableHeader column="status" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <SortableHeader column="questionnaire" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <SortableHeader column="modality" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <SortableHeader column="pricingPlan" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <SortableHeader column="amount" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <SortableHeader column="notes" sort={sort} onSort={(column) => setSort((current) => nextClientTableSort(current, column))} />
              <th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleClients.length ? visibleClients.map((client) => {
              const detailHref = getClientDetailHref(client.id, "/admin/clientes");

              return (
                <tr key={client.id}>
                  <td className="clients-table__name">
                    <Link className="font-black hover:text-primary" href={detailHref}>
                      {client.name}
                    </Link>
                  </td>
                  <td className="clients-table__status" data-label="Alta / baja">
                    <ClientStatusSwitch clientId={client.id} clientName={client.name} status={client.status} />
                  </td>
                  <td className="clients-table__questionnaire" data-label="Cuestionario">{client.onboardingComplete ? "Completado" : "Pendiente"}</td>
                  <td className="clients-table__modality" data-label="Modalidad">
                    <QuickCommercialSelect
                      key={`modality-${client.modality ?? "unassigned"}`}
                      clientId={client.id}
                      field="modality"
                      value={client.modality ?? ""}
                      label={`Modalidad de ${client.name}`}
                      className="w-full md:w-36"
                      options={client.modality
                        ? serviceModalityOptions
                        : [{ value: "", label: "Sin asignar" }, ...serviceModalityOptions]}
                    />
                  </td>
                  <td className="clients-table__pricing" data-label="Tarifa">
                    <QuickCommercialSelect
                      key={`pricing-${client.pricingPlanId ?? "unassigned"}`}
                      clientId={client.id}
                      field="pricingPlanId"
                      value={client.pricingPlanId ?? ""}
                      label={`Tarifa de ${client.name}`}
                      className="w-full md:w-48"
                      options={[
                        { value: "", label: "Sin asignar" },
                        ...pricingPlans
                        .filter((plan) => plan.active || plan.id === client.pricingPlanId)
                        .map((plan) => ({
                          value: plan.id,
                          label: `${plan.name} · ${pricingPlanDetailsLabel(plan)} · ${billingCycleLabel(plan.billingCycle)}`,
                        })),
                      ]}
                    />
                  </td>
                  <td className="clients-table__amount whitespace-nowrap font-bold" data-label="Precio">
                    {client.agreedAmountEur == null ? "—" : formatMoney(client.agreedAmountEur)}
                  </td>
                  <td className="clients-table__notes" data-label="Notas internas">
                    <ClientAdminNotesForm clientId={client.id} initialNotes={client.notes} compact />
                  </td>
                  <td className="clients-table__actions">
                    <ClientRowActions client={client} pricingPlans={pricingPlans} detailHref={detailHref} />
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={8} className="clients-table__empty py-10 text-center text-muted">
                  No hay clientes que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> : null}
      {view !== "table" && visibleClients.length ? <ClientsAlternativeView clients={visibleClients} pricingPlans={pricingPlans} view={view} /> : null}
      {view !== "table" && !visibleClients.length ? <p className="px-5 py-10 text-center text-muted">No hay clientes que coincidan con el filtro.</p> : null}
    </Card>
  );
}
