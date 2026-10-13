"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Pencil, Plus, Trash2, X } from "lucide-react";
import { DeleteFeeForm, FeeForm } from "@/components/forms/admin-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import {
  emptyFeeFilters,
  filterFees,
  type AdminFee,
  type FeeFilters,
} from "@/lib/admin/fees";
import { formatMoney, statusLabel } from "@/lib/format";

const PAGE_SIZE = 10;

type ClientOption = { id: string; full_name: string };

function FeeSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Mostrar formulario para registrar cuota"
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
      Registrar cuota
    </button>
  );
}

function FeeFiltersPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: FeeFilters;
  onChange: (next: FeeFilters) => void;
  onClear: () => void;
}) {
  const setFilter = <Key extends keyof FeeFilters>(key: Key, value: FeeFilters[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-3 border-t border-border bg-surface-muted p-4 sm:grid-cols-2 xl:grid-cols-5">
      <Input
        aria-label="Filtrar por cliente o nota"
        placeholder="Cliente o nota"
        value={filters.query}
        onChange={(event) => setFilter("query", event.target.value)}
        className="min-h-11"
      />
      <Input
        aria-label="Filtrar por periodo"
        type="month"
        value={filters.period}
        onChange={(event) => setFilter("period", event.target.value)}
        className="min-h-11"
      />
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
        className="min-h-11"
        menuPortal
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          aria-label="Importe mínimo"
          inputMode="decimal"
          placeholder="Mín. €"
          value={filters.minAmount}
          onChange={(event) => setFilter("minAmount", event.target.value)}
          className="min-h-11 min-w-0"
        />
        <Input
          aria-label="Importe máximo"
          inputMode="decimal"
          placeholder="Máx. €"
          value={filters.maxAmount}
          onChange={(event) => setFilter("maxAmount", event.target.value)}
          className="min-h-11 min-w-0"
        />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onClear}>Limpiar filtros</Button>
    </div>
  );
}

export function FeesManager({ clients, fees }: { clients: ClientOption[]; fees: AdminFee[] }) {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FeeFilters>(emptyFeeFilters);
  const [page, setPage] = useState(1);
  const [editingFee, setEditingFee] = useState<AdminFee | null>(null);
  const [deletingFee, setDeletingFee] = useState<AdminFee | null>(null);

  const filteredFees = useMemo(() => filterFees(fees, filters), [fees, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredFees.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageFees = filteredFees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = [filters.query, filters.period, filters.status !== "all" ? filters.status : "", filters.minAmount, filters.maxAmount]
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

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FeeSwitch checked={showForm} onChange={() => setShowForm((visible) => !visible)} />
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={showFilters}
              aria-controls="fee-filters"
              onClick={() => setShowFilters((visible) => !visible)}
            >
              <Filter className="size-4" aria-hidden="true" />
              Filtros{activeFilterCount ? ` (${activeFilterCount})` : ""}
            </Button>
          </div>

          {showFilters ? (
            <div id="fee-filters">
              <FeeFiltersPanel
                filters={filters}
                onChange={updateFilters}
                onClear={() => updateFilters(emptyFeeFilters)}
              />
            </div>
          ) : null}

          {pageFees.length ? (
            <div className="fees-table-shell">
              <table className="data-table fees-table table-fixed">
                <colgroup>
                  <col className="w-[16%]" />
                  <col className="w-[30%]" />
                  <col className="w-[18%]" />
                  <col className="w-[18%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr><th>Periodo</th><th>Cliente</th><th>Importe</th><th>Estado</th><th className="text-right">Acciones</th></tr>
                </thead>
                <tbody>
                  {pageFees.map((fee) => (
                    <tr key={fee.id} id={`cuota-${fee.id}`} className="scroll-mt-24 target:bg-primary-soft">
                      <td className="fees-table__period font-bold" data-label="Periodo">{fee.period}</td>
                      <td className="fees-table__client truncate" data-label="Cliente" title={fee.clientName}>{fee.clientName}</td>
                      <td className="fees-table__amount whitespace-nowrap font-bold" data-label="Importe">{formatMoney(fee.amountEur)}</td>
                      <td className="fees-table__status" data-label="Estado">
                        <Badge tone={fee.status === "paid" ? "success" : fee.status === "pending" ? "warning" : "neutral"}>{statusLabel(fee.status)}</Badge>
                      </td>
                      <td className="fees-table__actions">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" aria-label={`Editar cuota de ${fee.clientName}, ${fee.period}`} onClick={() => setEditingFee(fee)}>
                            <Pencil className="size-4" aria-hidden="true" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" aria-label={`Eliminar cuota de ${fee.clientName}, ${fee.period}`} onClick={() => setDeletingFee(fee)}>
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="border-t border-border px-5 py-10 text-center text-muted">No hay cuotas que coincidan con los filtros.</p>
          )}

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
