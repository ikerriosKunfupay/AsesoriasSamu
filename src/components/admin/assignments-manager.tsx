"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AssignmentForm } from "@/components/forms/admin-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionFormSwitch } from "@/components/ui/section-form-switch";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import { formatDate, statusLabel } from "@/lib/format";

const PAGE_SIZE = 10;

type AssignmentKind = "workout" | "nutrition";

export type AdminAssignment = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  status: "draft" | "published";
  version: number;
  startsOn: string | null;
  createdAt: string;
};

const copy = {
  workout: {
    createLabel: "Crear entrenamiento",
    switchLabel: "Mostrar formulario para crear entrenamiento",
    formTitle: "Nuevo entrenamiento",
    listTitle: "Entrenamientos creados",
    empty: "Aún no hay entrenamientos asignados.",
    returnTo: "/admin/entrenamientos",
  },
  nutrition: {
    createLabel: "Crear pauta nutricional",
    switchLabel: "Mostrar formulario para crear pauta nutricional",
    formTitle: "Nueva pauta nutricional",
    listTitle: "Pautas nutricionales creadas",
    empty: "Aún no hay pautas nutricionales asignadas.",
    returnTo: "/admin/nutricion",
  },
} as const;

export function AssignmentsManager({
  kind,
  clients,
  assignments,
}: {
  kind: AssignmentKind;
  clients: Array<{ id: string; full_name: string }>;
  assignments: AdminAssignment[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const labels = copy[kind];
  const totalPages = Math.max(1, Math.ceil(assignments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageAssignments = assignments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SectionFormSwitch
          checked={showForm}
          label={labels.createLabel}
          ariaLabel={labels.switchLabel}
          onChange={() => setShowForm((visible) => !visible)}
        />
        <p className="text-sm font-bold text-muted">
          {assignments.length} {assignments.length === 1 ? "registro" : "registros"}
        </p>
      </div>

      <div className={`grid min-w-0 gap-5 ${showForm ? "xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]" : "grid-cols-1"}`}>
        {showForm ? (
          <Card className="min-w-0 self-start">
            <h2 className="mb-5 text-xl font-black">{labels.formTitle}</h2>
            <AssignmentForm kind={kind} clients={clients} compact />
          </Card>
        ) : null}

        <Card className="min-w-0 overflow-hidden p-0">
          <div className="p-4 sm:px-5">
            <h2 className="text-xl font-black">{labels.listTitle}</h2>
            <p className="text-sm text-muted">Hasta 10 registros por página.</p>
          </div>

          {pageAssignments.length ? (
            <div className="assignments-table-shell">
              <table className="data-table assignments-table table-fixed">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[28%]" />
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead><tr><th>Plan</th><th>Cliente</th><th>Inicio</th><th>Versión</th><th>Estado</th></tr></thead>
                <tbody>
                  {pageAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="assignments-table__plan truncate font-black" data-label="Plan" title={assignment.title}>{assignment.title}</td>
                      <td className="assignments-table__client truncate" data-label="Cliente">
                        <Link className="text-primary hover:underline" href={getClientDetailHref(assignment.clientId, labels.returnTo)}>{assignment.clientName}</Link>
                      </td>
                      <td className="assignments-table__start whitespace-nowrap" data-label="Inicio">{formatDate(assignment.startsOn ?? assignment.createdAt)}</td>
                      <td className="assignments-table__version" data-label="Versión">v{assignment.version}</td>
                      <td className="assignments-table__status" data-label="Estado">
                        <Badge tone={assignment.status === "published" ? "success" : "neutral"}>{statusLabel(assignment.status)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="border-t border-border px-5 py-10 text-center text-muted">{labels.empty}</p>
          )}

          {totalPages > 1 ? (
            <nav className="flex items-center justify-center gap-3 border-t border-border p-4" aria-label={`Paginación de ${labels.listTitle.toLowerCase()}`}>
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
    </div>
  );
}
