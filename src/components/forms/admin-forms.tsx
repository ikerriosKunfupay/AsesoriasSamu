"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import {
  deleteFeeAction,
  inviteClientAction,
  saveAssignmentAction,
  saveClientAdminNoteAction,
  saveFeeAction,
  setClientStatusAction,
  updateFeeAction,
} from "@/app/actions/admin";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
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
}: {
  clientId?: string;
  clients?: Array<{ id: string; full_name: string }>;
  kind: "workout" | "nutrition";
  compact?: boolean;
}) {
  const [state, action] = useActionState(saveAssignmentAction, initialActionState);
  const formId = useId();
  const titleId = `${formId}-${kind}-title`;
  const contentId = `${formId}-${kind}-content`;
  const clientFieldId = `${formId}-${kind}-client`;
  const startsOnId = `${formId}-${kind}-starts-on`;
  const statusId = `${formId}-${kind}-status`;

  return (
    <form action={action} className="grid gap-5">
      {clientId ? <input type="hidden" name="clientId" value={clientId} /> : (
        <Field label="Cliente" htmlFor={clientFieldId} required error={state.fieldErrors?.clientId?.[0]}>
          <InternalSelect
            id={clientFieldId}
            name="clientId"
            ariaLabel={kind === "workout" ? "Cliente del entrenamiento" : "Cliente de la pauta nutricional"}
            options={clients.map((client) => ({ value: client.id, label: client.full_name }))}
            placeholder="Selecciona un cliente"
            required
            invalid={Boolean(state.fieldErrors?.clientId)}
            menuPortal
          />
        </Field>
      )}
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      <Field label="Título" htmlFor={titleId} required error={state.fieldErrors?.title?.[0]}>
        <Input id={titleId} name="title" required placeholder={kind === "workout" ? "Fuerza · Semana 1" : "Plan nutricional · Octubre"} />
      </Field>
      <Field label="Contenido del plan" htmlFor={contentId} required error={state.fieldErrors?.content?.[0]} hint="Puedes usar saltos de línea para ordenar días, ejercicios o comidas.">
        <Textarea id={contentId} name="content" rows={compact ? 7 : 10} required />
      </Field>
      <div className={cn("grid gap-5", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <Field label="Fecha de inicio" htmlFor={startsOnId} error={state.fieldErrors?.startsOn?.[0]}>
          <Input id={startsOnId} name="startsOn" type="date" />
        </Field>
        <Field label="Estado" htmlFor={statusId} required error={state.fieldErrors?.status?.[0]}>
          <InternalSelect
            id={statusId}
            name="status"
            ariaLabel="Estado del plan"
            defaultValue="published"
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
      <SubmitButton pendingLabel="Guardando…">Guardar plan</SubmitButton>
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
