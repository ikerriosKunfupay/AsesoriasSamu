"use client";

import { useActionState, useId, useState } from "react";
import {
  archivePricingPlanAction,
  saveClientCommercialTermsAction,
  savePricingPlanAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  billingCycleOptions,
  type ClientCommercialTermsValue,
  type PricingPlanOption,
  serviceModalityOptions,
} from "@/lib/admin/commercial-terms";
import { initialActionState } from "@/lib/forms/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

const selectClassName = "min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5";

function decimalInputValue(value: number | null | undefined) {
  return value == null ? "" : String(value).replace(".", ",");
}

export function ClientCommercialTermsForm({
  clientId,
  pricingPlans,
  initialTerms,
}: {
  clientId: string;
  pricingPlans: PricingPlanOption[];
  initialTerms: ClientCommercialTermsValue;
}) {
  const formId = useId();
  const selectablePlans = pricingPlans.filter(
    (plan) => plan.active || plan.id === initialTerms?.pricingPlanId,
  );
  const fallbackPlan = selectablePlans.find((plan) => plan.active);
  const initialPlanId = initialTerms?.pricingPlanId ?? fallbackPlan?.id ?? "new";
  const initialPlan = selectablePlans.find((plan) => plan.id === initialPlanId);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [newBillingCycle, setNewBillingCycle] = useState("annual");
  const [amountEur, setAmountEur] = useState(
    decimalInputValue(initialTerms?.agreedAmountEur ?? initialPlan?.defaultAmountEur),
  );
  const [state, action] = useActionState(saveClientCommercialTermsAction, initialActionState);
  const creatingPlan = selectedPlanId === "new";

  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="clientId" value={clientId} />
      <FormMessage state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Modalidad"
          htmlFor={`${formId}-modality`}
          required
          error={state.fieldErrors?.modality?.[0]}
        >
          <select
            id={`${formId}-modality`}
            name="modality"
            defaultValue={initialTerms?.modality ?? "in_person"}
            className={selectClassName}
          >
            {serviceModalityOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Tarifa"
          htmlFor={`${formId}-pricing-plan`}
          required
          error={state.fieldErrors?.pricingPlanId?.[0]}
        >
          <select
            id={`${formId}-pricing-plan`}
            name="pricingPlanId"
            value={selectedPlanId}
            className={selectClassName}
            onChange={(event) => {
              const nextPlanId = event.target.value;
              setSelectedPlanId(nextPlanId);
              const nextPlan = selectablePlans.find((plan) => plan.id === nextPlanId);
              if (nextPlan) setAmountEur(decimalInputValue(nextPlan.defaultAmountEur));
              if (nextPlanId === "new") setAmountEur("");
            }}
          >
            {selectablePlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} · {decimalInputValue(plan.defaultAmountEur)} €{plan.active ? "" : " · retirada"}
              </option>
            ))}
            <option value="new">+ Crear una tarifa nueva</option>
          </select>
        </Field>
      </div>
      {creatingPlan ? (
        <div className="grid gap-5 rounded-[var(--radius-md)] border border-primary/30 bg-primary-soft p-4 md:grid-cols-2">
          <Field
            label="Nombre de la nueva tarifa"
            htmlFor={`${formId}-new-plan-name`}
            required
            error={state.fieldErrors?.newPlanName?.[0]}
          >
            <Input
              id={`${formId}-new-plan-name`}
              name="newPlanName"
              maxLength={80}
              placeholder="Ej. Anual"
            />
          </Field>
          <Field
            label="Periodicidad"
            htmlFor={`${formId}-new-cycle`}
            required
            error={state.fieldErrors?.newBillingCycle?.[0]}
          >
            <select
              id={`${formId}-new-cycle`}
              name="newBillingCycle"
              value={newBillingCycle}
              onChange={(event) => setNewBillingCycle(event.target.value)}
              className={selectClassName}
            >
              {billingCycleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </Field>
          {newBillingCycle === "custom" ? (
            <Field
              label="Meses que cubre"
              htmlFor={`${formId}-new-duration`}
              required
              error={state.fieldErrors?.newDurationMonths?.[0]}
            >
              <Input id={`${formId}-new-duration`} name="newDurationMonths" type="number" min={1} max={120} defaultValue={1} />
            </Field>
          ) : null}
        </div>
      ) : null}
      <Field
        label="Precio acordado (€)"
        htmlFor={`${formId}-amount`}
        required
        error={state.fieldErrors?.amountEur?.[0]}
        hint="Al elegir una tarifa se propone su precio habitual, pero puedes cambiarlo solo para este cliente."
      >
        <Input
          id={`${formId}-amount`}
          name="amountEur"
          type="text"
          inputMode="decimal"
          value={amountEur}
          onChange={(event) => setAmountEur(event.target.value)}
          placeholder="0,00"
          required
        />
      </Field>
      <SubmitButton pendingLabel="Guardando…">Guardar condiciones</SubmitButton>
    </form>
  );
}

export function PricingPlanForm({ plan }: { plan?: PricingPlanOption }) {
  const formId = useId();
  const [billingCycle, setBillingCycle] = useState(plan?.billingCycle ?? "monthly");
  const [state, action] = useActionState(savePricingPlanAction, initialActionState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-[1fr_180px_160px_auto] md:items-end" noValidate>
      <input type="hidden" name="pricingPlanId" value={plan?.id ?? ""} />
      <Field label="Nombre" htmlFor={`${formId}-name`} required error={state.fieldErrors?.name?.[0]}>
        <Input id={`${formId}-name`} name="name" defaultValue={plan?.name ?? ""} maxLength={80} placeholder="Ej. Mensual" />
      </Field>
      <Field label="Periodicidad" htmlFor={`${formId}-cycle`} required error={state.fieldErrors?.billingCycle?.[0]}>
        <select
          id={`${formId}-cycle`}
          name="billingCycle"
          value={billingCycle}
          onChange={(event) => setBillingCycle(event.target.value as typeof billingCycle)}
          className={selectClassName}
        >
          {billingCycleOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </Field>
      {billingCycle === "custom" ? (
        <Field label="Meses" htmlFor={`${formId}-duration`} required error={state.fieldErrors?.durationMonths?.[0]}>
          <Input id={`${formId}-duration`} name="durationMonths" type="number" min={1} max={120} defaultValue={plan?.durationMonths ?? 1} />
        </Field>
      ) : <input type="hidden" name="durationMonths" value={plan?.durationMonths ?? 1} />}
      <Field label="Precio habitual (€)" htmlFor={`${formId}-amount`} required error={state.fieldErrors?.amountEur?.[0]}>
        <Input
          id={`${formId}-amount`}
          name="amountEur"
          type="text"
          inputMode="decimal"
          defaultValue={decimalInputValue(plan?.defaultAmountEur)}
          placeholder="0,00"
        />
      </Field>
      <SubmitButton pendingLabel="Guardando…">{plan ? "Actualizar" : "Crear tarifa"}</SubmitButton>
      <div className="md:col-span-4"><FormMessage state={state} /></div>
    </form>
  );
}

export function ArchivePricingPlanButton({ pricingPlanId, planName }: { pricingPlanId: string; planName: string }) {
  const [state, action, pending] = useActionState(archivePricingPlanAction, initialActionState);

  return (
    <div className="grid justify-items-start gap-2">
      <form action={action}>
        <input type="hidden" name="pricingPlanId" value={pricingPlanId} />
        <Button
          type="submit"
          variant="danger"
          disabled={pending}
          aria-label={`Eliminar ${planName} del selector`}
        >
          {pending ? "Eliminando…" : "Eliminar del selector"}
        </Button>
      </form>
      <FormMessage state={state} />
    </div>
  );
}
