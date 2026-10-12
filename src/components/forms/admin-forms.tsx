"use client";

import { useActionState } from "react";
import { inviteClientAction, saveAssignmentAction, saveFeeAction } from "@/app/actions/admin";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
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
