"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Filter, Pencil, Trash2, X } from "lucide-react";
import { DeleteFeeForm, FeeForm, FeeNoteInput } from "@/components/forms/admin-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataViewToggle, usePersistedDataView } from "@/components/ui/data-view-toggle";
import { Input } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import { SectionFormSwitch } from "@/components/ui/section-form-switch";
import {
  emptyFeeFilters,
  filterAndSortFees,
  nextFeeSort,
  type AdminFee,
  type FeeFilters,
  type FeeSort,
  type FeeSortKey,
} from "@/lib/admin/fees";
import { formatMoney, statusLabel } from "@/lib/format";

const PAGE_SIZE = 10;

type ClientOption = { id: string; full_name: string };

const feeColumnLabels: Record<FeeSortKey, string> = {
  period: "Periodo",
  client: "Cliente",
  amount: "Importe",
  status: "Estado",
  notes: "Nota interna",
};

function SortableFeeHeader({ column, sort, onSort }: { column: FeeSortKey; sort: FeeSort; onSort: (column: FeeSortKey) => void }) {
  const direction = sort?.key === column ? sort.direction : null;
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;
  const nextState = direction === "asc" ? "descendente" : direction === "desc" ? "original" : "ascendente";
  return (
    <th aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}>
      <button type="button" className="inline-flex min-h-10 items-center gap-2 text-left font-black hover:text-primary" aria-label={`Ordenar ${feeColumnLabels[column]} en orden ${nextState}`} onClick={() => onSort(column)}>
        {feeColumnLabels[column]}<Icon className="size-4" aria-hidden="true" />
      </button>
    </th>
  );
}

function FeeFiltersPanel({
  filters,
  periods,
  onChange,
}: {
  filters: FeeFilters;
  periods: string[];
  onChange: (next: FeeFilters) => void;
}) {
  const setFilter = <Key extends keyof FeeFilters>(key: Key, value: FeeFilters[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-3 border-t border-border bg-surface-muted p-4 sm:grid-cols-2 xl:grid-cols-5">
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">Cliente
        <Input aria-label="Filtrar por cliente" placeholder="Nombre…" value={filters.client} onChange={(event) => setFilter("client", event.target.value)} className="min-h-10 text-sm normal-case tracking-normal text-foreground" />
      </label>
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">Periodo
        <InternalSelect id="fee-period-filter" ariaLabel="Filtrar por periodo" value={filters.period} onValueChange={(value) => setFilter("period", value)} options={[{ value: "", label: "Todos los periodos" }, ...periods.map((period) => ({ value: period, label: period }))]} className="min-h-10 text-sm normal-case tracking-normal" menuPortal />
      </label>
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">Estado
      <InternalSelect
        id="fee-status-filter"
        ariaLabel="Filtrar por estado"
        value={filters.status}
        onValueChange={(value) => setFilter("status", value as FeeFilters["status"])}
        options={[
          { value: "all", label: "Todos los estados" },
          { value: "pending", label: "Pendientes" },
          { value: "paid", label: "Pagadas" },
          { value: "waived", label: "Exentas" },
        ]}
        className="min-h-10 text-sm normal-case tracking-normal"
        menuPortal
      />
      </label>
      <fieldset className="grid gap-1.5"><legend className="text-xs font-black uppercase tracking-wide text-muted">Importe (€)</legend><div className="grid grid-cols-2 gap-2">
        <Input
          aria-label="Importe mínimo"
          inputMode="decimal"
          placeholder="Mín. €"
          value={filters.minAmount}
          onChange={(event) => setFilter("minAmount", event.target.value)}
          className="min-h-10 min-w-0 text-sm"
        />
        <Input
          aria-label="Importe máximo"
          inputMode="decimal"
          placeholder="Máx. €"
          value={filters.maxAmount}
          onChange={(event) => setFilter("maxAmount", event.target.value)}
          className="min-h-10 min-w-0 text-sm"
        />
      </div></fieldset>
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">Nota interna
        <Input aria-label="Filtrar por nota interna" placeholder="Contenido…" value={filters.notes} onChange={(event) => setFilter("notes", event.target.value)} className="min-h-10 text-sm normal-case tracking-normal text-foreground" />
      </label>
    </div>
  );
}

function FeeStatusBadge({ fee }: { fee: AdminFee }) {
  return <Badge tone={fee.status === "paid" ? "success" : fee.status === "pending" ? "warning" : "neutral"}>{statusLabel(fee.status)}</Badge>;
}

function FeeActions({ fee, onEdit, onDelete }: { fee: AdminFee; onEdit: (fee: AdminFee) => void; onDelete: (fee: AdminFee) => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" size="sm" aria-label={`Editar cuota de ${fee.clientName}, ${fee.period}`} onClick={() => onEdit(fee)}><Pencil className="size-4" aria-hidden="true" /></Button>
      <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" aria-label={`Eliminar cuota de ${fee.clientName}, ${fee.period}`} onClick={() => onDelete(fee)}><Trash2 className="size-4" aria-hidden="true" /></Button>
    </div>
  );
}

export function FeesManager({ clients, fees }: { clients: ClientOption[]; fees: AdminFee[] }) {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FeeFilters>(emptyFeeFilters);
  const [sort, setSort] = useState<FeeSort>(null);
  const [view, setView] = usePersistedDataView("team-ortega:fees-view");
  const [page, setPage] = useState(1);
  const [editingFee, setEditingFee] = useState<AdminFee | null>(null);
  const [deletingFee, setDeletingFee] = useState<AdminFee | null>(null);

  const filteredFees = useMemo(() => filterAndSortFees(fees, filters, sort), [fees, filters, sort]);
  const periods = useMemo(() => [...new Set(fees.map((fee) => fee.period))].sort((left, right) => right.localeCompare(left)), [fees]);
  const totalPages = Math.max(1, Math.ceil(filteredFees.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageFees = filteredFees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = [filters.client, filters.notes, filters.period, filters.status !== "all" ? filters.status : "", filters.minAmount, filters.maxAmount]
    .filter(Boolean).length;

  useEffect(() => {
    if (!editingFee && !deletingFee) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditingFee(null);
        setDeletingFee(null);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [deletingFee, editingFee]);

  const updateFilters = (next: FeeFilters) => {
    setFilters(next);
    setPage(1);
  };

  const resetTable = () => {
    setFilters({ ...emptyFeeFilters });
    setSort(null);
    setPage(1);
  };

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SectionFormSwitch
          checked={showForm}
          label="Registrar cuota"
          ariaLabel="Mostrar formulario para registrar cuota"
          onChange={() => setShowForm((visible) => !visible)}
        />
        <p className="text-sm font-bold text-muted" aria-live="polite">
          {filteredFees.length} {filteredFees.length === 1 ? "cuota" : "cuotas"}
        </p>
      </div>

      <div className={`grid min-w-0 gap-5 ${showForm ? "xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]" : "grid-cols-1"}`}>
        {showForm ? (
          <Card className="min-w-0 self-start">
            <h2 className="mb-5 text-xl font-black">Registrar cuota</h2>
            <FeeForm clients={clients} compact />
          </Card>
        ) : null}

        <Card className="min-w-0 overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
            <div>
              <h2 className="text-xl font-black">Cuotas registradas</h2>
              <p className="text-sm text-muted">Hasta 10 registros por página.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DataViewToggle view={view} onChange={setView} label="Vista de cuotas" />
              <Button type="button" variant="outline" size="sm" aria-expanded={showFilters} aria-controls="fee-filters" onClick={() => setShowFilters((visible) => !visible)}>
                <Filter className="size-4" aria-hidden="true" />Filtros
                {activeFilterCount ? <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{activeFilterCount}</span> : null}
              </Button>
              {activeFilterCount || sort ? <Button type="button" variant="ghost" size="sm" onClick={resetTable}><X className="size-4" aria-hidden="true" />Restablecer</Button> : null}
            </div>
          </div>

          {showFilters ? (
            <div id="fee-filters">
              <FeeFiltersPanel
                filters={filters}
                periods={periods}
                onChange={updateFilters}
              />
            </div>
          ) : null}

          {pageFees.length && view === "table" ? (
            <div className="fees-table-shell">
              <table className="data-table fees-table table-fixed">
                <colgroup>
                  <col className="w-[12%]" />
                  <col className="w-[20%]" />
                  <col className="w-[13%]" />
                  <col className="w-[13%]" />
                  <col className="w-[27%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr>
                    {(["period", "client", "amount", "status", "notes"] as const).map((column) => <SortableFeeHeader key={column} column={column} sort={sort} onSort={(nextColumn) => setSort((current) => nextFeeSort(current, nextColumn))} />)}
                    <th className="text-right"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {pageFees.map((fee) => (
                    <tr key={fee.id} id={`cuota-${fee.id}`} className="scroll-mt-24 target:bg-primary-soft">
                      <td className="fees-table__period font-bold" data-label="Periodo">{fee.period}</td>
                      <td className="fees-table__client truncate" data-label="Cliente" title={fee.clientName}>{fee.clientName}</td>
                      <td className="fees-table__amount whitespace-nowrap font-bold" data-label="Importe">{formatMoney(fee.amountEur)}</td>
                      <td className="fees-table__status" data-label="Estado"><FeeStatusBadge fee={fee} /></td>
                      <td className="fees-table__notes" data-label="Nota interna"><FeeNoteInput feeId={fee.id} clientName={fee.clientName} period={fee.period} initialNotes={fee.notes} /></td>
                      <td className="fees-table__actions">
                        <FeeActions fee={fee} onEdit={setEditingFee} onDelete={setDeletingFee} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {pageFees.length && view === "list" ? (
            <div className="grid gap-3 border-t border-border p-4">
              {pageFees.map((fee) => (
                <article key={fee.id} id={`cuota-${fee.id}`} className="grid gap-4 rounded-[var(--radius-md)] border border-border p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="grid min-w-0 gap-3 sm:grid-cols-4 sm:items-center">
                    <div><p className="text-xs font-black uppercase tracking-wide text-muted">Periodo</p><p className="font-black">{fee.period}</p></div>
                    <div className="min-w-0"><p className="text-xs font-black uppercase tracking-wide text-muted">Cliente</p><p className="truncate">{fee.clientName}</p></div>
                    <div><p className="text-xs font-black uppercase tracking-wide text-muted">Importe</p><p className="font-black">{formatMoney(fee.amountEur)}</p></div>
                    <FeeStatusBadge fee={fee} />
                  </div>
                  <FeeActions fee={fee} onEdit={setEditingFee} onDelete={setDeletingFee} />
                  <div className="lg:col-span-2"><FeeNoteInput feeId={fee.id} clientName={fee.clientName} period={fee.period} initialNotes={fee.notes} /></div>
                </article>
              ))}
            </div>
          ) : null}

          {pageFees.length && view === "gallery" ? (
            <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageFees.map((fee) => (
                <article key={fee.id} id={`cuota-${fee.id}`} className="flex min-h-64 flex-col rounded-[var(--radius-md)] border border-border p-4">
                  <div className="flex items-start justify-between gap-3"><FeeStatusBadge fee={fee} /><p className="font-black">{fee.period}</p></div>
                  <h3 className="mt-5 text-xl font-black">{fee.clientName}</h3>
                  <p className="mt-1 text-2xl font-black">{formatMoney(fee.amountEur)}</p>
                  <div className="mt-5"><FeeNoteInput feeId={fee.id} clientName={fee.clientName} period={fee.period} initialNotes={fee.notes} /></div>
                  <div className="mt-auto pt-5"><FeeActions fee={fee} onEdit={setEditingFee} onDelete={setDeletingFee} /></div>
                </article>
              ))}
            </div>
          ) : null}

          {!pageFees.length ? (
            <p className="border-t border-border px-5 py-10 text-center text-muted">No hay cuotas que coincidan con los filtros.</p>
          ) : null}

          {totalPages > 1 ? (
            <nav className="flex items-center justify-center gap-3 border-t border-border p-4" aria-label="Paginación de cuotas">
              <Button type="button" variant="outline" size="sm" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <span className="min-w-24 text-center text-sm font-bold">{currentPage} de {totalPages}</span>
              <Button type="button" variant="outline" size="sm" aria-label="Página siguiente" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </nav>
          ) : null}
        </Card>
      </div>

      {editingFee ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingFee(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="fee-editor-title" className="relative w-full max-w-4xl rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xl sm:p-7">
            <button type="button" aria-label="Cerrar edición de cuota" onClick={() => setEditingFee(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground">
              <X className="size-5" aria-hidden="true" />
            </button>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Editar cuota</p>
            <h2 id="fee-editor-title" className="mb-6 mt-2 pr-12 text-2xl font-black">{editingFee.clientName} · {editingFee.period}</h2>
            <FeeForm key={editingFee.id} clients={clients} initialFee={editingFee} onSuccess={() => setEditingFee(null)} />
          </section>
        </div>
      ) : null}

      {deletingFee ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeletingFee(null); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="fee-delete-title" aria-describedby="fee-delete-description" className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-2xl">
            <button type="button" aria-label="Cerrar eliminación de cuota" onClick={() => setDeletingFee(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground">
              <X className="size-5" aria-hidden="true" />
            </button>
            <h2 id="fee-delete-title" className="pr-12 text-2xl font-black">Eliminar cuota</h2>
            <p id="fee-delete-description" className="mb-5 mt-3 text-sm text-muted">
              Se eliminará la cuota de {deletingFee.clientName} del periodo {deletingFee.period}. Esta acción no se puede deshacer.
            </p>
            <DeleteFeeForm feeId={deletingFee.id} />
          </section>
        </div>
      ) : null}
    </div>
  );
}
