import type { BillingCycle, ServiceModality } from "@/lib/supabase/database.types";

export const billingCycleOptions: Array<{ value: BillingCycle; label: string }> = [
  { value: "monthly", label: "Mensual" },
  { value: "semiannual", label: "Semestral" },
  { value: "annual", label: "Anual" },
  { value: "custom", label: "Personalizada" },
];

export const serviceModalityOptions: Array<{ value: ServiceModality; label: string }> = [
  { value: "in_person", label: "Presencial" },
  { value: "online", label: "Virtual" },
];

export type PricingPlanOption = {
  id: string;
  name: string;
  billingCycle: BillingCycle;
  durationMonths: number;
  serviceModality: ServiceModality | null;
  daysPerWeek: number | null;
  defaultAmountEur: number;
  active: boolean;
};

export type ClientCommercialTermsValue = {
  modality: ServiceModality;
  pricingPlanId: string | null;
  agreedAmountEur: number;
} | null;

export function billingCycleLabel(value: BillingCycle | null | undefined) {
  return billingCycleOptions.find((option) => option.value === value)?.label ?? "Sin tarifa";
}

export function serviceModalityLabel(value: ServiceModality | null | undefined) {
  return serviceModalityOptions.find((option) => option.value === value)?.label ?? "Sin asignar";
}

export function daysPerWeekLabel(value: number | null | undefined) {
  if (!value) return "Días sin definir";
  return `${value} ${value === 1 ? "día" : "días"}/semana`;
}

export function pricingPlanDetailsLabel(plan: Pick<PricingPlanOption, "serviceModality" | "daysPerWeek">) {
  return `${serviceModalityLabel(plan.serviceModality)} · ${daysPerWeekLabel(plan.daysPerWeek)}`;
}

export function billingCycleMonths(value: BillingCycle, customMonths = 1) {
  if (value === "semiannual") return 6;
  if (value === "annual") return 12;
  if (value === "custom") return customMonths;
  return 1;
}
