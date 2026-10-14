"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { AssignmentForm, DeleteAssignmentForm } from "@/components/forms/admin-forms";
import { WorkoutPlanBuilder } from "@/components/forms/workout-plan-builder";
import { AssignmentTemplatesManager } from "@/components/admin/assignment-templates-manager";
import { WorkoutPlanPreview } from "@/components/admin/workout-plan-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataViewToggle, usePersistedDataView } from "@/components/ui/data-view-toggle";
import { Input } from "@/components/ui/input";
import { InternalDatePicker } from "@/components/ui/internal-date-picker";
import { InternalSelect } from "@/components/ui/internal-select";
import { SectionFormSwitch } from "@/components/ui/section-form-switch";
import {
  emptyAssignmentFilters,
  filterAndSortAssignments,
  nextAssignmentSort,
  type AdminAssignment,
  type AssignmentFilters,
  type AssignmentSort,
  type AssignmentSortKey,
  type AssignmentTemplate,
} from "@/lib/admin/assignments";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import type { ExerciseCatalogItem } from "@/lib/admin/exercise-catalog";
import { formatDate, statusLabel } from "@/lib/format";
import type { WorkoutPlan } from "@/lib/workouts/plan";

const PAGE_SIZE = 10;
type AssignmentKind = "workout" | "nutrition";

const copy = {
  workout: {
    createLabel: "Crear entrenamiento",
    switchLabel: "Mostrar formulario para crear entrenamiento",
    formTitle: "Nuevo entrenamiento",
    listTitle: "Entrenamientos creados",
    singular: "entrenamiento",
    empty: "Aún no hay entrenamientos asignados.",
    returnTo: "/admin/entrenamientos",
  },
  nutrition: {
    createLabel: "Crear pauta nutricional",
    switchLabel: "Mostrar formulario para crear pauta nutricional",
    formTitle: "Nueva pauta nutricional",
    listTitle: "Pautas nutricionales creadas",
    singular: "pauta nutricional",
    empty: "Aún no hay pautas nutricionales asignadas.",
    returnTo: "/admin/nutricion",
  },
} as const;

const columnLabels: Record<AssignmentSortKey, string> = {
  title: "Plan",
  client: "Cliente",
  startsOn: "Inicio",
  status: "Estado",
};

function SortableHeader({ column, sort, onSort }: { column: AssignmentSortKey; sort: AssignmentSort; onSort: (column: AssignmentSortKey) => void }) {
  const direction = sort?.key === column ? sort.direction : null;
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;
  const nextState = direction === "asc" ? "descendente" : direction === "desc" ? "original" : "ascendente";

  return (
    <th aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}>
      <button type="button" className="inline-flex min-h-10 items-center gap-2 text-left font-black hover:text-primary" aria-label={`Ordenar ${columnLabels[column]} en orden ${nextState}`} onClick={() => onSort(column)}>
        {columnLabels[column]}
        <Icon aria-hidden="true" className="size-4" />
      </button>
    </th>
  );
}

function AssignmentFiltersPanel({
  kind,
  filters,
  onChange,
}: {
  kind: AssignmentKind;
  filters: AssignmentFilters;
  onChange: <Key extends keyof AssignmentFilters>(key: Key, value: AssignmentFilters[Key]) => void;
}) {
  return (
    <div className="grid gap-3 border-t border-border bg-surface-muted p-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
        Plan
        <Input value={filters.title} onChange={(event) => onChange("title", event.target.value)} placeholder="Título…" className="min-h-10 text-sm normal-case tracking-normal text-foreground" />
      </label>
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
        Cliente
        <Input value={filters.client} onChange={(event) => onChange("client", event.target.value)} placeholder="Nombre…" className="min-h-10 text-sm normal-case tracking-normal text-foreground" />
      </label>
      <div className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
        Inicio desde
        <InternalDatePicker id={`${kind}-filter-start-from`} ariaLabel="Filtrar inicio desde" value={filters.startsFrom} onValueChange={(value) => onChange("startsFrom", value)} className="min-h-10 text-sm normal-case tracking-normal" />
      </div>
      <div className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
        Inicio hasta
        <InternalDatePicker id={`${kind}-filter-start-to`} ariaLabel="Filtrar inicio hasta" value={filters.startsTo} onValueChange={(value) => onChange("startsTo", value)} className="min-h-10 text-sm normal-case tracking-normal" />
      </div>
      <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
        Estado
        <InternalSelect
          id={`${kind}-filter-status`}
          ariaLabel="Filtrar por estado"
          value={filters.status}
          options={[
            { value: "all", label: "Todos" },
            { value: "published", label: "Publicados" },
            { value: "draft", label: "Borradores" },
          ]}
          className="min-h-10 text-sm normal-case tracking-normal"
          onValueChange={(value) => onChange("status", value as AssignmentFilters["status"])}
          menuPortal
        />
      </label>
    </div>
  );
}

export function AssignmentsManager({
  kind,
  clients,
  assignments,
  templates = [],
  workoutInitialPlan,
  exerciseCatalog = [],
}: {
  kind: AssignmentKind;
  clients: Array<{ id: string; full_name: string }>;
  assignments: AdminAssignment[];
  templates?: AssignmentTemplate[];
  workoutInitialPlan?: WorkoutPlan;
  exerciseCatalog?: ExerciseCatalogItem[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<AssignmentFilters>({ ...emptyAssignmentFilters });
  const [sort, setSort] = useState<AssignmentSort>(null);
  const [view, setView] = usePersistedDataView(`team-ortega:${kind}-assignments-view`);
  const [page, setPage] = useState(1);
  const [viewingAssignment, setViewingAssignment] = useState<AdminAssignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<AdminAssignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<AdminAssignment | null>(null);
  const labels = copy[kind];
  const visibleAssignments = useMemo(() => filterAndSortAssignments(assignments, filters, sort), [assignments, filters, sort]);
  const totalPages = Math.max(1, Math.ceil(visibleAssignments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageAssignments = visibleAssignments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => key === "status" ? value !== "all" : String(value).trim() !== "").length;
  const usesStructuredWorkoutForm = kind === "workout" && Boolean(workoutInitialPlan);

  useEffect(() => {
    if (!viewingAssignment && !editingAssignment && !deletingAssignment) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setViewingAssignment(null);
      setEditingAssignment(null);
      setDeletingAssignment(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [deletingAssignment, editingAssignment, viewingAssignment]);

  function updateFilter<Key extends keyof AssignmentFilters>(key: Key, value: AssignmentFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetTable() {
    setFilters({ ...emptyAssignmentFilters });
    setSort(null);
    setPage(1);
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SectionFormSwitch checked={showForm} label={labels.createLabel} ariaLabel={labels.switchLabel} onChange={() => setShowForm((visible) => !visible)} />
          <AssignmentTemplatesManager kind={kind} templates={templates} />
        </div>
        <p className="text-sm font-bold text-muted" aria-live="polite">{visibleAssignments.length} de {assignments.length}</p>
      </div>

      <div className={`grid min-w-0 gap-5 ${showForm && !usesStructuredWorkoutForm ? "xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]" : "grid-cols-1"}`}>
        {showForm ? (
          <Card className="min-w-0 self-start">
            <h2 className="text-xl font-black">{labels.formTitle}</h2>
            {usesStructuredWorkoutForm ? (
              <>
                <p className="mb-6 mt-1 text-sm text-muted">Elige el cliente y organiza su bloque por semanas, sesiones, ejercicios y series.</p>
                <WorkoutPlanBuilder clients={clients} initialPlan={workoutInitialPlan!} exerciseCatalog={exerciseCatalog} />
              </>
            ) : (
              <div className="mt-5">
                <AssignmentForm kind={kind} clients={clients} templates={templates} compact />
              </div>
            )}
          </Card>
        ) : null}

        <Card className="min-w-0 overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
            <div>
              <h2 className="text-xl font-black">{labels.listTitle}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DataViewToggle view={view} onChange={setView} label={`Vista de ${labels.listTitle.toLowerCase()}`} />
              <Button type="button" variant="outline" size="sm" aria-expanded={filtersOpen} aria-controls={`${kind}-assignment-filters`} onClick={() => setFiltersOpen((open) => !open)}><Filter className="size-4" aria-hidden="true" />Filtros{activeFilterCount ? ` (${activeFilterCount})` : ""}</Button>
              {activeFilterCount || sort ? <Button type="button" variant="ghost" size="sm" onClick={resetTable}><X className="size-4" aria-hidden="true" />Restablecer</Button> : null}
            </div>
          </div>

          {filtersOpen ? <div id={`${kind}-assignment-filters`}><AssignmentFiltersPanel kind={kind} filters={filters} onChange={updateFilter} /></div> : null}

          {pageAssignments.length && view === "table" ? (
            <div className="assignments-table-shell">
              <table className="data-table assignments-table table-fixed">
                <colgroup><col className="w-[25%]" /><col className="w-[22%]" /><col className="w-[18%]" /><col className="w-[15%]" /><col className="w-[20%]" /></colgroup>
                <thead><tr>
                  {(["title", "client", "startsOn", "status"] as const).map((column) => <SortableHeader key={column} column={column} sort={sort} onSort={(nextColumn) => setSort((current) => nextAssignmentSort(current, nextColumn))} />)}
                  <th className="text-right"><span className="sr-only">Acciones</span></th>
                </tr></thead>
                <tbody>
                  {pageAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="assignments-table__plan truncate font-black" data-label="Plan" title={assignment.title}>{assignment.title}</td>
                      <td className="assignments-table__client truncate" data-label="Cliente"><Link className="text-primary hover:underline" href={getClientDetailHref(assignment.clientId, labels.returnTo)}>{assignment.clientName}</Link></td>
                      <td className="assignments-table__start whitespace-nowrap" data-label="Inicio">{formatDate(assignment.startsOn ?? assignment.createdAt)}</td>
                      <td className="assignments-table__status overflow-hidden" data-label="Estado"><Badge className="max-w-full truncate" tone={assignment.status === "published" ? "success" : "neutral"}>{statusLabel(assignment.status)}</Badge></td>
                      <td className="assignments-table__actions" data-label="Acciones">
                        <div className="flex justify-end gap-1.5">
                          <Button type="button" variant="outline" size="sm" aria-label={`Ver ${labels.singular} ${assignment.title}`} onClick={() => setViewingAssignment(assignment)}><Eye className="size-4" aria-hidden="true" /></Button>
                          <Button type="button" variant="outline" size="sm" aria-label={`Editar ${labels.singular} ${assignment.title}`} onClick={() => setEditingAssignment(assignment)}><Pencil className="size-4" aria-hidden="true" /></Button>
                          <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" aria-label={`Eliminar ${labels.singular} ${assignment.title}`} onClick={() => setDeletingAssignment(assignment)}><Trash2 className="size-4" aria-hidden="true" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {pageAssignments.length && view === "list" ? (
            <div className="grid gap-3 border-t border-border p-4">
              {pageAssignments.map((assignment) => (
                <article key={assignment.id} className="grid gap-4 rounded-[var(--radius-md)] border border-border p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="grid min-w-0 gap-3 sm:grid-cols-4 sm:items-center">
                    <div className="min-w-0"><p className="text-xs font-black uppercase tracking-wide text-muted">Plan</p><p className="truncate font-black" title={assignment.title}>{assignment.title}</p></div>
                    <div className="min-w-0"><p className="text-xs font-black uppercase tracking-wide text-muted">Cliente</p><Link className="block truncate text-primary hover:underline" href={getClientDetailHref(assignment.clientId, labels.returnTo)}>{assignment.clientName}</Link></div>
                    <div><p className="text-xs font-black uppercase tracking-wide text-muted">Inicio</p><p>{formatDate(assignment.startsOn ?? assignment.createdAt)}</p></div>
                    <Badge tone={assignment.status === "published" ? "success" : "neutral"}>{statusLabel(assignment.status)}</Badge>
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <Button type="button" variant="outline" size="sm" aria-label={`Ver ${labels.singular} ${assignment.title}`} onClick={() => setViewingAssignment(assignment)}><Eye className="size-4" aria-hidden="true" /></Button>
                    <Button type="button" variant="outline" size="sm" aria-label={`Editar ${labels.singular} ${assignment.title}`} onClick={() => setEditingAssignment(assignment)}><Pencil className="size-4" aria-hidden="true" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" aria-label={`Eliminar ${labels.singular} ${assignment.title}`} onClick={() => setDeletingAssignment(assignment)}><Trash2 className="size-4" aria-hidden="true" /></Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {pageAssignments.length && view === "gallery" ? (
            <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageAssignments.map((assignment) => (
                <article key={assignment.id} className="flex min-h-64 flex-col rounded-[var(--radius-md)] border border-border p-4">
                  <div className="flex items-start justify-between gap-3"><Badge tone={assignment.status === "published" ? "success" : "neutral"}>{statusLabel(assignment.status)}</Badge><p className="text-sm text-muted">{formatDate(assignment.startsOn ?? assignment.createdAt)}</p></div>
                  <h3 className="mt-5 text-xl font-black">{assignment.title}</h3>
                  <Link className="mt-2 text-primary hover:underline" href={getClientDetailHref(assignment.clientId, labels.returnTo)}>{assignment.clientName}</Link>
                  <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm text-muted">{assignment.content}</p>
                  <div className="mt-auto flex justify-end gap-1.5 pt-5">
                    <Button type="button" variant="outline" size="sm" aria-label={`Ver ${labels.singular} ${assignment.title}`} onClick={() => setViewingAssignment(assignment)}><Eye className="size-4" aria-hidden="true" /></Button>
                    <Button type="button" variant="outline" size="sm" aria-label={`Editar ${labels.singular} ${assignment.title}`} onClick={() => setEditingAssignment(assignment)}><Pencil className="size-4" aria-hidden="true" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" aria-label={`Eliminar ${labels.singular} ${assignment.title}`} onClick={() => setDeletingAssignment(assignment)}><Trash2 className="size-4" aria-hidden="true" /></Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {!pageAssignments.length ? <p className="border-t border-border px-5 py-10 text-center text-muted">{activeFilterCount ? "No hay planes que coincidan con los filtros." : labels.empty}</p> : null}

          {totalPages > 1 ? (
            <nav className="flex items-center justify-center gap-3 border-t border-border p-4" aria-label={`Paginación de ${labels.listTitle.toLowerCase()}`}>
              <Button type="button" variant="outline" size="sm" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft className="size-4" aria-hidden="true" /></Button>
              <span className="min-w-24 text-center text-sm font-bold">{currentPage} de {totalPages}</span>
              <Button type="button" variant="outline" size="sm" aria-label="Página siguiente" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}><ChevronRight className="size-4" aria-hidden="true" /></Button>
            </nav>
          ) : null}
        </Card>
      </div>

      {viewingAssignment ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewingAssignment(null); }}>
          <article role="dialog" aria-modal="true" aria-labelledby="assignment-view-title" className={`relative w-full rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xl sm:p-7 ${viewingAssignment.planData ? "max-w-6xl" : "max-w-4xl"}`}>
            <button type="button" aria-label="Cerrar plan" onClick={() => setViewingAssignment(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"><X className="size-5" aria-hidden="true" /></button>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{labels.singular}</p>
            <h2 id="assignment-view-title" className="mt-2 pr-12 text-2xl font-black">{viewingAssignment.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted"><span>{viewingAssignment.clientName}</span><span aria-hidden="true">·</span><span>{formatDate(viewingAssignment.startsOn ?? viewingAssignment.createdAt)}</span><Badge tone={viewingAssignment.status === "published" ? "success" : "neutral"}>{statusLabel(viewingAssignment.status)}</Badge></div>
            <div className="mt-6 max-h-[70vh] overflow-y-auto pr-1">
              {kind === "workout" && viewingAssignment.planData ? (
                <WorkoutPlanPreview plan={viewingAssignment.planData} />
              ) : (
                <div className="whitespace-pre-wrap rounded-[var(--radius-md)] border border-border bg-surface-muted p-4 leading-7">{viewingAssignment.content}</div>
              )}
            </div>
          </article>
        </div>
      ) : null}

      {editingAssignment ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingAssignment(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="assignment-editor-title" className={`relative w-full rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xl sm:p-7 ${editingAssignment.planData ? "max-w-6xl" : "max-w-4xl"}`}>
            <button type="button" aria-label="Cerrar edición del plan" onClick={() => setEditingAssignment(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"><X className="size-5" aria-hidden="true" /></button>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Editar {labels.singular}</p>
            <h2 id="assignment-editor-title" className="mb-6 mt-2 pr-12 text-2xl font-black">{editingAssignment.title}</h2>
            <div className="max-h-[75vh] overflow-y-auto pr-1">
              {kind === "workout" && editingAssignment.planData ? (
                <WorkoutPlanBuilder
                  key={editingAssignment.id}
                  assignmentId={editingAssignment.id}
                  clients={clients}
                  initialClientId={editingAssignment.clientId}
                  initialTitle={editingAssignment.title}
                  initialStartsOn={editingAssignment.startsOn}
                  initialStatus={editingAssignment.status}
                  initialPlan={editingAssignment.planData}
                  exerciseCatalog={exerciseCatalog}
                  onSuccess={() => setEditingAssignment(null)}
                />
              ) : (
                <AssignmentForm key={editingAssignment.id} kind={kind} clients={clients} templates={templates} initialAssignment={editingAssignment} onSuccess={() => setEditingAssignment(null)} />
              )}
            </div>
          </section>
        </div>
      ) : null}

      {deletingAssignment ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeletingAssignment(null); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="assignment-delete-title" aria-describedby="assignment-delete-description" className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-2xl">
            <button type="button" aria-label="Cerrar eliminación del plan" onClick={() => setDeletingAssignment(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"><X className="size-5" aria-hidden="true" /></button>
            <h2 id="assignment-delete-title" className="pr-12 text-2xl font-black">Eliminar {labels.singular}</h2>
            <p id="assignment-delete-description" className="mb-5 mt-3 text-sm text-muted">Se eliminará «{deletingAssignment.title}» de {deletingAssignment.clientName}. Esta acción no se puede deshacer.</p>
            <DeleteAssignmentForm assignmentId={deletingAssignment.id} kind={kind} onSuccess={() => setDeletingAssignment(null)} />
          </section>
        </div>
      ) : null}
    </div>
  );
}
