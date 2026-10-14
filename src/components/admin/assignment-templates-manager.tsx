"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { ChevronLeft, Files, Pencil, Trash2, X } from "lucide-react";
import {
  deleteAssignmentTemplateAction,
  updateAssignmentTemplateAction,
} from "@/app/actions/admin";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import type { AssignmentTemplate } from "@/lib/admin/assignments";
import { initialActionState } from "@/lib/forms/action-state";

type AssignmentKind = "workout" | "nutrition";

const labels = {
  workout: {
    plural: "plantillas de entrenamiento",
    singular: "plantilla de entrenamiento",
  },
  nutrition: {
    plural: "plantillas de nutrición",
    singular: "plantilla de nutrición",
  },
} as const;

function AssignmentTemplateForm({
  kind,
  template,
  onSuccess,
}: {
  kind: AssignmentKind;
  template: AssignmentTemplate;
  onSuccess: () => void;
}) {
  const [state, action] = useActionState(updateAssignmentTemplateAction, initialActionState);
  const formId = useId();

  useEffect(() => {
    if (state.status === "success") onSuccess();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="templateId" value={template.id} />
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      <Field
        label="Nombre de la plantilla"
        htmlFor={`${formId}-name`}
        required
        error={state.fieldErrors?.name?.[0]}
      >
        <Input id={`${formId}-name`} name="name" defaultValue={template.name} required />
      </Field>
      <Field label="Título del plan" htmlFor={`${formId}-title`} required error={state.fieldErrors?.title?.[0]}>
        <Input id={`${formId}-title`} name="title" defaultValue={template.title} required />
      </Field>
      <Field
        label="Contenido del plan"
        htmlFor={`${formId}-content`}
        required
        error={state.fieldErrors?.content?.[0]}
      >
        <Textarea id={`${formId}-content`} name="content" rows={10} defaultValue={template.content} required />
      </Field>
      <SubmitButton pendingLabel="Actualizando…">Actualizar plantilla</SubmitButton>
    </form>
  );
}

function DeleteAssignmentTemplateForm({
  kind,
  templateId,
  onSuccess,
}: {
  kind: AssignmentKind;
  templateId: string;
  onSuccess: () => void;
}) {
  const [state, action] = useActionState(deleteAssignmentTemplateAction, initialActionState);

  useEffect(() => {
    if (state.status === "success") onSuccess();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="templateId" value={templateId} />
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      <SubmitButton className="bg-danger hover:opacity-90" pendingLabel="Eliminando…">
        Eliminar plantilla
      </SubmitButton>
    </form>
  );
}

export function AssignmentTemplatesManager({
  kind,
  templates,
}: {
  kind: AssignmentKind;
  templates: AssignmentTemplate[];
}) {
  const [open, setOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AssignmentTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<AssignmentTemplate | null>(null);
  const copy = labels[kind];

  function closeManager() {
    setEditingTemplate(null);
    setDeletingTemplate(null);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (editingTemplate || deletingTemplate) {
        setEditingTemplate(null);
        setDeletingTemplate(null);
        return;
      }
      closeManager();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [deletingTemplate, editingTemplate, open]);

  const titleId = deletingTemplate
    ? `${kind}-template-delete-title`
    : editingTemplate
      ? `${kind}-template-edit-title`
      : `${kind}-templates-title`;

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Files className="size-4" aria-hidden="true" />
        Gestionar plantillas{templates.length ? ` (${templates.length})` : ""}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeManager();
          }}
        >
          <section
            role={deletingTemplate ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={deletingTemplate ? `${kind}-template-delete-description` : undefined}
            className="relative w-full max-w-4xl rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              aria-label="Cerrar gestión de plantillas"
              onClick={closeManager}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            {editingTemplate ? (
              <>
                <Button type="button" variant="ghost" size="sm" className="mb-3 px-0" onClick={() => setEditingTemplate(null)}>
                  <ChevronLeft className="size-4" aria-hidden="true" /> Volver a plantillas
                </Button>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Editar plantilla</p>
                <h2 id={titleId} className="mb-6 mt-2 pr-12 text-2xl font-black">{editingTemplate.name}</h2>
                <AssignmentTemplateForm
                  key={editingTemplate.id}
                  kind={kind}
                  template={editingTemplate}
                  onSuccess={() => setEditingTemplate(null)}
                />
              </>
            ) : deletingTemplate ? (
              <>
                <h2 id={titleId} className="pr-12 text-2xl font-black">Eliminar {copy.singular}</h2>
                <p id={`${kind}-template-delete-description`} className="mb-5 mt-3 text-sm text-muted">
                  Se eliminará «{deletingTemplate.name}». Los planes ya creados no cambiarán, pero no podrás volver a elegir esta plantilla.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button type="button" variant="outline" onClick={() => setDeletingTemplate(null)}>Cancelar</Button>
                  <DeleteAssignmentTemplateForm
                    key={deletingTemplate.id}
                    kind={kind}
                    templateId={deletingTemplate.id}
                    onSuccess={() => setDeletingTemplate(null)}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Biblioteca interna</p>
                <h2 id={titleId} className="mt-2 pr-12 text-2xl font-black capitalize">{copy.plural}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Edita el nombre y el contenido reutilizable o elimina las plantillas que ya no necesites.
                </p>
                {templates.length ? (
                  <div className="mt-6 grid max-h-[60vh] gap-3 overflow-y-auto pr-1">
                    {templates.map((template) => (
                      <article key={template.id} className="grid gap-4 rounded-[var(--radius-md)] border border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black" title={template.name}>{template.name}</h3>
                          {template.title !== template.name ? <p className="mt-1 truncate text-sm font-bold">{template.title}</p> : null}
                          <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-muted">{template.content}</p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                            <Pencil className="size-4" aria-hidden="true" /> Editar
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-soft" onClick={() => setDeletingTemplate(template)}>
                            <Trash2 className="size-4" aria-hidden="true" /> Eliminar
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 rounded-[var(--radius-md)] border border-dashed border-border p-6 text-center text-muted">
                    Aún no hay plantillas. Puedes crear una al guardar un plan.
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
