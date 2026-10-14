"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Filter, Pencil, Trash2, X } from "lucide-react";
import { DeleteExerciseCatalogForm, ExerciseCatalogForm } from "@/components/forms/exercise-catalog-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import { SectionFormSwitch } from "@/components/ui/section-form-switch";
import { filterExerciseCatalog, type ExerciseCatalogItem } from "@/lib/admin/exercise-catalog";

const PAGE_SIZE = 20;

export function ExerciseCatalogManager({ catalog }: { catalog: ExerciseCatalogItem[] }) {
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [page, setPage] = useState(1);
  const [editingExercise, setEditingExercise] = useState<ExerciseCatalogItem | null>(null);
  const [deletingExercise, setDeletingExercise] = useState<ExerciseCatalogItem | null>(null);
  const muscleGroups = useMemo(() => [...new Set(catalog.map((item) => item.muscleGroup))], [catalog]);
  const visibleExercises = useMemo(
    () => filterExerciseCatalog(catalog, query, muscleGroup),
    [catalog, muscleGroup, query],
  );
  const totalPages = Math.max(1, Math.ceil(visibleExercises.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageExercises = visibleExercises.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (!editingExercise && !deletingExercise) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditingExercise(null);
        setDeletingExercise(null);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [deletingExercise, editingExercise]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const updateMuscleGroup = (value: string) => {
    setMuscleGroup(value);
    setPage(1);
  };

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SectionFormSwitch
          checked={showForm}
          label="Añadir ejercicio"
          ariaLabel="Mostrar formulario para añadir un ejercicio"
          onChange={() => setShowForm((visible) => !visible)}
        />
        <p className="text-sm font-bold text-muted" aria-live="polite">{visibleExercises.length} de {catalog.length} ejercicios</p>
      </div>

      <div className={`grid min-w-0 gap-5 ${showForm ? "xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]" : "grid-cols-1"}`}>
        {showForm ? (
          <Card className="min-w-0 self-start">
            <h2 className="text-xl font-black">Nuevo ejercicio</h2>
            <p className="mb-5 mt-1 text-sm text-muted">Las claves se copiarán automáticamente al elegirlo en un entrenamiento.</p>
            <ExerciseCatalogForm muscleGroups={muscleGroups} />
          </Card>
        ) : null}

        <Card className="min-w-0 overflow-hidden p-0">
          <div className="grid gap-4 p-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.45fr)]">
            <label className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Buscar
              <Input
                aria-label="Buscar en la biblioteca"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Ejercicio, músculo o clave…"
                className="text-base normal-case tracking-normal text-foreground"
              />
            </label>
            <div className="grid gap-1.5 text-xs font-black uppercase tracking-wide text-muted">
              Grupo muscular
              <InternalSelect
                id="exercise-catalog-muscle-filter"
                ariaLabel="Filtrar biblioteca por grupo muscular"
                value={muscleGroup}
                onValueChange={updateMuscleGroup}
                options={[{ value: "", label: "Todos los músculos" }, ...muscleGroups.map((group) => ({ value: group, label: group }))]}
                className="text-sm normal-case tracking-normal"
                menuPortal
              />
            </div>
          </div>

          {(query || muscleGroup) ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-muted px-4 py-3 sm:px-5">
              <Filter aria-hidden="true" className="size-4 text-muted" />
              <span className="text-sm font-bold">Filtros activos</span>
              <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => { updateQuery(""); updateMuscleGroup(""); }}>
                <X aria-hidden="true" className="size-4" />Restablecer
              </Button>
            </div>
          ) : null}

          {pageExercises.length ? (
            <div className="divide-y divide-border border-t border-border">
              {pageExercises.map((exercise) => (
                <article key={exercise.id} className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{exercise.muscleGroup}</Badge>
                      <h2 className="font-black">{exercise.name}</h2>
                    </div>
                    {exercise.cues ? <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted">{exercise.cues}</p> : <p className="mt-3 text-sm text-muted">Sin claves guardadas.</p>}
                    {exercise.referenceUrl ? (
                      <a className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-primary hover:underline" href={exercise.referenceUrl} target="_blank" rel="noreferrer">
                        Abrir técnica <ExternalLink aria-hidden="true" className="size-3.5" />
                      </a>
                    ) : null}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" aria-label={`Editar ${exercise.name}`} onClick={() => setEditingExercise(exercise)}><Pencil aria-hidden="true" className="size-4" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" aria-label={`Eliminar ${exercise.name}`} onClick={() => setDeletingExercise(exercise)}><Trash2 aria-hidden="true" className="size-4" /></Button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="border-t border-border px-5 py-12 text-center text-muted">No hay ejercicios que coincidan con la búsqueda.</p>}

          {totalPages > 1 ? (
            <nav className="flex items-center justify-center gap-3 border-t border-border p-4" aria-label="Paginación de la biblioteca de ejercicios">
              <Button type="button" variant="outline" size="sm" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft aria-hidden="true" className="size-4" /></Button>
              <span className="min-w-24 text-center text-sm font-bold">{currentPage} de {totalPages}</span>
              <Button type="button" variant="outline" size="sm" aria-label="Página siguiente" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}><ChevronRight aria-hidden="true" className="size-4" /></Button>
            </nav>
          ) : null}
        </Card>
      </div>

      {editingExercise ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingExercise(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="exercise-editor-title" className="relative w-full max-w-3xl rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xl sm:p-7">
            <button type="button" aria-label="Cerrar edición del ejercicio" onClick={() => setEditingExercise(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"><X aria-hidden="true" className="size-5" /></button>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Biblioteca</p>
            <h2 id="exercise-editor-title" className="mb-6 mt-2 pr-12 text-2xl font-black">Editar {editingExercise.name}</h2>
            <ExerciseCatalogForm key={editingExercise.id} muscleGroups={muscleGroups} initialExercise={editingExercise} onSuccess={() => setEditingExercise(null)} />
          </section>
        </div>
      ) : null}

      {deletingExercise ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeletingExercise(null); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="exercise-delete-title" aria-describedby="exercise-delete-description" className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-2xl">
            <button type="button" aria-label="Cerrar eliminación del ejercicio" onClick={() => setDeletingExercise(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"><X aria-hidden="true" className="size-5" /></button>
            <h2 id="exercise-delete-title" className="pr-12 text-2xl font-black">Eliminar ejercicio</h2>
            <p id="exercise-delete-description" className="mb-5 mt-3 text-sm leading-6 text-muted">
              Se eliminará «{deletingExercise.name}» de la biblioteca. Los entrenamientos ya creados conservarán su nombre y sus claves.
            </p>
            <DeleteExerciseCatalogForm exerciseId={deletingExercise.id} onSuccess={() => setDeletingExercise(null)} />
          </section>
        </div>
      ) : null}
    </div>
  );
}
