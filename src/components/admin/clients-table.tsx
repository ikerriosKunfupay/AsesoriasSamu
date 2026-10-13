"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { ClientCommercialTermsEditor } from "@/components/admin/client-commercial-terms-editor";
import {
  ClientAdminNotesForm,
  ClientStatusSwitch,
} from "@/components/forms/admin-forms";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import {
  billingCycleLabel,
  serviceModalityLabel,
  type PricingPlanOption,
} from "@/lib/admin/commercial-terms";
import {
  filterAndSortClients,
  nextClientTableSort,
  type ClientTableItem,
  type ClientTableSort,
  type ClientTableSortKey,
} from "@/lib/admin/client-table";
import { formatMoney } from "@/lib/format";

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

export function ClientsTable({
  clients,
  pricingPlans,
}: {
  clients: ClientTableItem[];
  pricingPlans: PricingPlanOption[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ClientTableSort>(null);
  const visibleClients = useMemo(
    () => filterAndSortClients(clients, query, sort),
    [clients, query, sort],
  );

  function resetTable() {
    setQuery("");
    setSort(null);
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, estado, modalidad, tarifa, precio o notas…"
            aria-label="Filtrar clientes"
            className="pl-11"
          />
        </div>
        {query || sort ? (
          <Button type="button" variant="ghost" onClick={resetTable}>
            <X aria-hidden="true" className="size-4" />
            Restablecer
          </Button>
        ) : null}
        <p className="shrink-0 text-sm font-bold text-muted" aria-live="polite">
          {visibleClients.length} de {clients.length}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
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
                  <td>
                    <Link className="font-black hover:text-primary" href={detailHref}>
                      {client.name}
                    </Link>
                  </td>
                  <td>
                    <ClientStatusSwitch clientId={client.id} clientName={client.name} status={client.status} />
                  </td>
                  <td>{client.onboardingComplete ? "Completado" : "Pendiente"}</td>
                  <td>{serviceModalityLabel(client.modality)}</td>
                  <td>
                    {client.pricingPlanName ? (
                      <span className="grid gap-0.5">
                        <b>{client.pricingPlanName}</b>
                        <small className="text-muted">{billingCycleLabel(client.billingCycle)}</small>
                      </span>
                    ) : "Sin asignar"}
                  </td>
                  <td className="whitespace-nowrap font-bold">
                    {client.agreedAmountEur == null ? "—" : formatMoney(client.agreedAmountEur)}
                  </td>
                  <td>
                    <ClientAdminNotesForm clientId={client.id} initialNotes={client.notes} compact />
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <ClientCommercialTermsEditor
                        clientId={client.id}
                        clientName={client.name}
                        pricingPlans={pricingPlans}
                        initialTerms={client.modality && client.agreedAmountEur != null ? {
                          modality: client.modality,
                          pricingPlanId: client.pricingPlanId,
                          agreedAmountEur: client.agreedAmountEur,
                        } : null}
                      />
                      <ButtonLink href={detailHref} size="sm" variant="outline">Ver ficha</ButtonLink>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={8} className="py-10 text-center text-muted">
                  No hay clientes que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
