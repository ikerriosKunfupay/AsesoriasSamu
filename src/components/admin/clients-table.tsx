"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import {
  ClientAdminNotesForm,
  ClientStatusSwitch,
} from "@/components/forms/admin-forms";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import {
  filterAndSortClients,
  nextClientTableSort,
  type ClientTableItem,
  type ClientTableSort,
  type ClientTableSortKey,
} from "@/lib/admin/client-table";

const columnLabels: Record<ClientTableSortKey, string> = {
  name: "Cliente",
  status: "Alta / baja",
  questionnaire: "Cuestionario",
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

export function ClientsTable({ clients }: { clients: ClientTableItem[] }) {
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
            placeholder="Buscar por cliente, estado, cuestionario o notas…"
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
                  <td>
                    <ClientAdminNotesForm clientId={client.id} initialNotes={client.notes} compact />
                  </td>
                  <td className="text-right">
                    <ButtonLink href={detailHref} size="sm" variant="outline">Ver ficha</ButtonLink>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted">
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
