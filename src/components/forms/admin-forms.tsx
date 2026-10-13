"use client";

import { useActionState, useId } from "react";
import {
  inviteClientAction,
  saveAssignmentAction,
  saveClientAdminNoteAction,
  saveFeeAction,
  setClientStatusAction,
} from "@/app/actions/admin";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
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

export function AssignmentForm({ clientId, kind }: { clientId: string; kind: "workout" | "nutrition" }) {
  const [state, action] = useActionState(saveAssignmentAction, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      <Field label="Título" htmlFor={`${kind}-title`} required error={state.fieldErrors?.title?.[0]}>
        <Input id={`${kind}-title`} name="title" required placeholder={kind === "workout" ? "Fuerza · Semana 1" : "Plan nutricional · Octubre"} />
      </Field>
      <Field label="Contenido del plan" htmlFor={`${kind}-content`} required error={state.fieldErrors?.content?.[0]} hint="Puedes usar saltos de línea para ordenar días, ejercicios o comidas.">
        <Textarea id={`${kind}-content`} name="content" rows={10} required />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Fecha de inicio" htmlFor={`${kind}-startsOn`} error={state.fieldErrors?.startsOn?.[0]}>
          <Input id={`${kind}-startsOn`} name="startsOn" type="date" />
        </Field>
        <Field label="Estado" htmlFor={`${kind}-status`} required error={state.fieldErrors?.status?.[0]}>
          <select id={`${kind}-status`} name="status" defaultValue="published" className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5">
            <option value="published">Publicado para el cliente</option>
            <option value="draft">Borrador</option>
          </select>
        </Field>
      </div>
      <SubmitButton pendingLabel="Guardando…">Guardar plan</SubmitButton>
    </form>
  );
}

export function FeeForm({ clients }: { clients: Array<{ id: string; full_name: string }> }) {
  const [state, action] = useActionState(saveFeeAction, initialActionState);
  const month = new Date().toISOString().slice(0, 7);
  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <Field label="Cliente" htmlFor="clientId" required error={state.fieldErrors?.clientId?.[0]}>
        <select id="clientId" name="clientId" required className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5">
          <option value="">Selecciona un cliente</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.full_name}</option>)}
        </select>
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Periodo" htmlFor="period" required error={state.fieldErrors?.period?.[0]}>
          <Input id="period" name="period" type="month" defaultValue={month} required />
        </Field>
        <Field label="Importe (€)" htmlFor="amountEur" required error={state.fieldErrors?.amountEur?.[0]}>
          <Input id="amountEur" name="amountEur" type="number" min="0" step="0.01" required />
        </Field>
        <Field label="Estado" htmlFor="status" required error={state.fieldErrors?.status?.[0]}>
          <select id="status" name="status" defaultValue="pending" className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5">
            <option value="pending">Pendiente</option>
            <option value="paid">Pagada</option>
            <option value="waived">Exenta</option>
          </select>
        </Field>
      </div>
      <Field label="Nota interna" htmlFor="notes"><Input id="notes" name="notes" /></Field>
      <p className="text-xs text-muted">Este registro es solo de control interno. La aplicación no procesa cobros.</p>
      <SubmitButton pendingLabel="Guardando…">Guardar cuota</SubmitButton>
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
  const [state, action] = useActionState(saveClientAdminNoteAction, initialActionState);

  return (
    <form action={action} className={cn("grid gap-2", compact ? "min-w-64" : "max-w-3xl gap-3")}>
      <input type="hidden" name="clientId" value={clientId} />
      <label className={cn("font-bold", compact ? "sr-only" : "text-sm")} htmlFor={fieldId}>
        Notas internas
      </label>
      <Textarea
        id={fieldId}
        name="notes"
        defaultValue={initialNotes}
        rows={compact ? 2 : 5}
        maxLength={5000}
        placeholder="Escribe un recordatorio privado sobre este cliente…"
        aria-describedby={compact ? undefined : `${fieldId}-hint`}
        className={compact ? "min-h-20 text-sm" : undefined}
      />
      {!compact ? (
        <p id={`${fieldId}-hint`} className="text-sm text-muted">
          Solo lo verá la administración. Anota información práctica y evita copiar informes médicos completos.
        </p>
      ) : null}
      <div className="flex flex-wrap items-start gap-3">
        <SubmitButton pendingLabel="Guardando…" className={compact ? "min-h-10 px-3" : undefined}>
          Guardar nota
        </SubmitButton>
        <div className="min-w-0 flex-1"><FormMessage state={state} /></div>
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
