"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import {
  deleteAssignmentAction,
  deleteFeeAction,
  inviteClientAction,
  saveAssignmentAction,
  saveClientAdminNoteAction,
  saveFeeAction,
  saveFeeNoteAction,
  setClientStatusAction,
  updateAssignmentAction,
  updateFeeAction,
} from "@/app/actions/admin";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { InternalDatePicker } from "@/components/ui/internal-date-picker";
import { InternalSelect } from "@/components/ui/internal-select";
import type { AdminAssignment, AssignmentTemplate } from "@/lib/admin/assignments";
import type { AdminFee } from "@/lib/admin/fees";
import { initialActionState } from "@/lib/forms/action-state";
import type { ProfileStatus } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function InviteClientForm() {
  const [state, action] = useActionState(inviteClientAction, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <Field label="Nombre y apellidos" htmlFor="fullName" required error={state.fieldErrors?.fullName?.[0]}>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </Field>
      <Field label="Correo electrónico" htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>
      <SubmitButton pendingLabel="Enviando…">Enviar invitación</SubmitButton>
    </form>
  );
}

export function AssignmentForm({
  clientId,
  clients = [],
  kind,
  compact = false,
  initialAssignment,
  templates = [],
  onSuccess,
}: {
  clientId?: string;
  clients?: Array<{ id: string; full_name: string }>;
  kind: "workout" | "nutrition";
  compact?: boolean;
  initialAssignment?: AdminAssignment;
  templates?: AssignmentTemplate[];
  onSuccess?: () => void;
}) {
  const [state, action] = useActionState(initialAssignment ? updateAssignmentAction : saveAssignmentAction, initialActionState);
  const formId = useId();
  const titleId = `${formId}-${kind}-title`;
  const contentId = `${formId}-${kind}-content`;
  const clientFieldId = `${formId}-${kind}-client`;
  const startsOnId = `${formId}-${kind}-starts-on`;
  const statusId = `${formId}-${kind}-status`;
  const templateId = `${formId}-${kind}-template`;
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [title, setTitle] = useState(initialAssignment?.title ?? "");
  const [content, setContent] = useState(initialAssignment?.content ?? "");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className="grid gap-5">
      {initialAssignment ? <input type="hidden" name="assignmentId" value={initialAssignment.id} /> : null}
      {clientId ? <input type="hidden" name="clientId" value={clientId} /> : (
        <Field label="Cliente" htmlFor={clientFieldId} required error={state.fieldErrors?.clientId?.[0]}>
          <InternalSelect
            id={clientFieldId}
            name="clientId"
            ariaLabel={kind === "workout" ? "Cliente del entrenamiento" : "Cliente de la pauta nutricional"}
            options={clients.map((client) => ({ value: client.id, label: client.full_name }))}
            placeholder="Selecciona un cliente"
            defaultValue={initialAssignment?.clientId ?? ""}
            required
            invalid={Boolean(state.fieldErrors?.clientId)}
            menuPortal
          />
        </Field>
      )}
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      {templates.length ? (
        <Field label="Plantilla" htmlFor={templateId}>
          <InternalSelect
            id={templateId}
            ariaLabel={`Plantilla de ${kind === "workout" ? "entrenamiento" : "nutrición"}`}
            value={selectedTemplateId}
            options={[
              { value: "", label: "Empezar desde cero" },
              ...templates.map((template) => ({ value: template.id, label: template.name })),
            ]}
            onValueChange={(value) => {
              setSelectedTemplateId(value);
              const template = templates.find((item) => item.id === value);
              if (!template) return;
              setTitle(template.title);
              setContent(template.content);
            }}
            menuPortal
          />
        </Field>
      ) : null}
      <Field label="Título" htmlFor={titleId} required error={state.fieldErrors?.title?.[0]}>
        <Input id={titleId} name="title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={kind === "workout" ? "Fuerza · Semana 1" : "Plan nutricional · Octubre"} />
      </Field>
      <Field label="Contenido del plan" htmlFor={contentId} required error={state.fieldErrors?.content?.[0]}>
        <Textarea id={contentId} name="content" rows={compact ? 7 : 10} value={content} onChange={(event) => setContent(event.target.value)} required />
      </Field>
      <div className={cn("grid gap-5", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <Field label="Fecha de inicio" htmlFor={startsOnId} error={state.fieldErrors?.startsOn?.[0]}>
          <InternalDatePicker
            id={startsOnId}
            name="startsOn"
            ariaLabel="Fecha de inicio"
            defaultValue={initialAssignment?.startsOn ?? ""}
            invalid={Boolean(state.fieldErrors?.startsOn)}
          />
        </Field>
        <Field label="Estado" htmlFor={statusId} required error={state.fieldErrors?.status?.[0]}>
          <InternalSelect
            id={statusId}
            name="status"
            ariaLabel="Estado del plan"
            defaultValue={initialAssignment?.status ?? "published"}
            options={[
              { value: "published", label: "Publicado para el cliente" },
              { value: "draft", label: "Borrador" },
            ]}
            required
            invalid={Boolean(state.fieldErrors?.status)}
            menuPortal
          />
        </Field>
      </div>
      {saveAsTemplate ? <input type="hidden" name="saveAsTemplate" value="on" /> : null}
      <button
        type="button"
        role="switch"
        aria-checked={saveAsTemplate}
        className="flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-left text-sm font-bold transition hover:bg-surface-muted"
        onClick={() => setSaveAsTemplate((current) => !current)}
      >
        <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${saveAsTemplate ? "bg-primary" : "bg-surface-muted"}`} aria-hidden="true">
          <span className={`absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform ${saveAsTemplate ? "translate-x-5" : ""}`} />
        </span>
        Guardar también como plantilla reutilizable
      </button>
      <SubmitButton pendingLabel="Guardando…">{initialAssignment ? "Actualizar plan" : "Guardar plan"}</SubmitButton>
    </form>
  );
}

export function DeleteAssignmentForm({
  assignmentId,
  kind,
  onSuccess,
}: {
  assignmentId: string;
  kind: "workout" | "nutrition";
  onSuccess?: () => void;
}) {
  const [state, action] = useActionState(deleteAssignmentAction, initialActionState);

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      <SubmitButton className="bg-danger hover:opacity-90" pendingLabel="Eliminando…">Eliminar plan</SubmitButton>
    </form>
  );
}

export function FeeForm({
  clients,
  initialFee,
  compact = false,
  onSuccess,
}: {
  clients: Array<{ id: string; full_name: string }>;
  initialFee?: AdminFee;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [state, action] = useActionState(initialFee ? updateFeeAction : saveFeeAction, initialActionState);
  const formId = useId();
  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [onSuccess, state.status]);

  const clientFieldId = `${formId}-client`;
  const periodFieldId = `${formId}-period`;
  const amountFieldId = `${formId}-amount`;
  const statusFieldId = `${formId}-status`;
  const notesFieldId = `${formId}-notes`;

  return (
    <form action={action} className="grid gap-5">
      {initialFee ? <input type="hidden" name="feeId" value={initialFee.id} /> : null}
      <FormMessage state={state} />
      <Field label="Cliente" htmlFor={clientFieldId} required error={state.fieldErrors?.clientId?.[0]}>
        <InternalSelect
          id={clientFieldId}
          name="clientId"
          ariaLabel="Cliente de la cuota"
          placeholder="Selecciona un cliente"
          defaultValue={initialFee?.clientId ?? ""}
          options={clients.map((client) => ({ value: client.id, label: client.full_name }))}
          required
          invalid={Boolean(state.fieldErrors?.clientId)}
          menuPortal
        />
      </Field>
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-3")}>
        <Field label="Periodo" htmlFor={periodFieldId} required error={state.fieldErrors?.period?.[0]}>
          <Input id={periodFieldId} name="period" type="month" defaultValue={initialFee?.period ?? month} required />
        </Field>
        <Field label="Importe (€)" htmlFor={amountFieldId} required error={state.fieldErrors?.amountEur?.[0]}>
          <Input id={amountFieldId} name="amountEur" type="number" min="0" max="10000" step="0.01" defaultValue={initialFee?.amountEur} required />
        </Field>
        <Field label="Estado" htmlFor={statusFieldId} required error={state.fieldErrors?.status?.[0]}>
          <InternalSelect
            id={statusFieldId}
            name="status"
            ariaLabel="Estado de la cuota"
            defaultValue={initialFee?.status ?? "pending"}
            options={[
              { value: "pending", label: "Pendiente" },
              { value: "paid", label: "Pagada" },
              { value: "waived", label: "Exenta" },
            ]}
            required
            invalid={Boolean(state.fieldErrors?.status)}
            menuPortal
          />
        </Field>
      </div>
      <Field label="Nota interna" htmlFor={notesFieldId} error={state.fieldErrors?.notes?.[0]}>
        <Input id={notesFieldId} name="notes" defaultValue={initialFee?.notes} maxLength={500} />
      </Field>
      <SubmitButton pendingLabel="Guardando…">{initialFee ? "Actualizar cuota" : "Guardar cuota"}</SubmitButton>
    </form>
  );
}

export function DeleteFeeForm({ feeId }: { feeId: string }) {
  const [state, action] = useActionState(deleteFeeAction, initialActionState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="feeId" value={feeId} />
      <FormMessage state={state} />
      <SubmitButton className="bg-danger hover:opacity-90" pendingLabel="Eliminando…">Eliminar cuota</SubmitButton>
    </form>
  );
}

export function FeeNoteInput({
  feeId,
  clientName,
  period,
  initialNotes,
}: {
  feeId: string;
  clientName: string;
  period: string;
  initialNotes: string;
}) {
  const fieldId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const lastSubmittedNotes = useRef(initialNotes);
  const [notes, setNotes] = useState(initialNotes);
  const [state, action, pending] = useActionState(saveFeeNoteAction, initialActionState);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  function queueSave(nextNotes: string, delay = 700) {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (nextNotes === lastSubmittedNotes.current) return;
    timeoutRef.current = window.setTimeout(() => {
      lastSubmittedNotes.current = nextNotes;
      formRef.current?.requestSubmit();
    }, delay);
  }

  return (
    <form ref={formRef} action={action} className="grid min-w-0 gap-1">
      <input type="hidden" name="feeId" value={feeId} />
      <label className="sr-only" htmlFor={fieldId}>Nota interna de {clientName}, {period}</label>
      <Input
        id={fieldId}
        name="notes"
        value={notes}
        maxLength={500}
        placeholder="Añadir nota…"
        className="min-h-10 min-w-0 text-sm"
        aria-describedby={`${fieldId}-status`}
        onChange={(event) => {
          setNotes(event.target.value);
          queueSave(event.target.value);
        }}
        onBlur={(event) => queueSave(event.target.value, 0)}
      />
      <span id={`${fieldId}-status`} className="sr-only" role={state.status === "error" ? "alert" : "status"} aria-live="polite">
        {pending ? "Guardando…" : state.status === "error" ? state.message : state.status === "success" ? "Guardado" : ""}
      </span>
    </form>
  );
}

export function ClientAdminNotesForm({
  clientId,
  initialNotes,
  compact = false,
}: {
  clientId: string;
  initialNotes: string;
  compact?: boolean;
}) {
  const fieldId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const lastSubmittedNotes = useRef(initialNotes);
  const [notes, setNotes] = useState(initialNotes);
  const [state, action, pending] = useActionState(saveClientAdminNoteAction, initialActionState);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  function queueSave(nextNotes: string, delay = 700) {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (nextNotes === lastSubmittedNotes.current) return;
    timeoutRef.current = window.setTimeout(() => {
      lastSubmittedNotes.current = nextNotes;
      formRef.current?.requestSubmit();
    }, delay);
  }

  const noteFieldProps = {
    id: fieldId,
    name: "notes",
    value: notes,
    maxLength: 5000,
    placeholder: "Escribe un recordatorio privado…",
    "aria-describedby": `${fieldId}-status`,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNotes(event.target.value);
      queueSave(event.target.value);
    },
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => queueSave(event.target.value, 0),
  };

  return (
    <form ref={formRef} action={action} className={cn("grid gap-2", compact ? "w-full gap-0 md:w-56" : "max-w-3xl gap-3")}>
      <input type="hidden" name="clientId" value={clientId} />
      <label className={cn("font-bold", compact ? "sr-only" : "text-sm")} htmlFor={fieldId}>
        Notas internas
      </label>
      {compact ? (
        <Input {...noteFieldProps} className="min-h-10 text-sm" />
      ) : (
        <Textarea {...noteFieldProps} rows={5} />
      )}
      <div id={`${fieldId}-status`} className={cn(compact ? "sr-only" : "min-h-4 text-xs", state.status === "error" ? "text-danger" : "text-muted")} aria-live="polite">
        {pending
          ? "Guardando…"
          : state.status === "error"
            ? state.message
            : state.status === "success"
              ? "Guardado"
              : compact ? "" : "Los cambios se guardan automáticamente."}
      </div>
    </form>
  );
}

export function ClientStatusSwitch({
  clientId,
  clientName,
  status,
}: {
  clientId: string;
  clientName: string;
  status: ProfileStatus;
}) {
  const [state, action, pending] = useActionState(setClientStatusAction, initialActionState);
  const isActive = status === "active";

  return (
    <div className="grid justify-items-start gap-2">
      <form action={action}>
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="nextStatus" value={isActive ? "archived" : "active"} />
        <button
          type="submit"
          role="switch"
          aria-checked={isActive}
          aria-label={isActive ? `Dar de baja a ${clientName}` : `Dar de alta a ${clientName}`}
          disabled={pending}
          className="inline-flex min-h-10 items-center gap-2.5 whitespace-nowrap rounded-full border border-border-strong bg-surface px-3 text-sm font-bold transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-55"
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              isActive ? "bg-success" : "bg-muted/45",
            )}
          >
            <span
              className={cn(
                "absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform",
                isActive ? "translate-x-5" : "translate-x-0",
              )}
            />
          </span>
          {pending ? "Guardando…" : isActive ? "Activo" : "Inactivo"}
        </button>
      </form>
      {state.status === "error" ? <FormMessage state={state} /> : null}
    </div>
  );
}
