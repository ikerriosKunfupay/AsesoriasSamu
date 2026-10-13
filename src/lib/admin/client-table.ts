import {
  billingCycleLabel,
  serviceModalityLabel,
} from "@/lib/admin/commercial-terms";
import type {
  BillingCycle,
  ProfileStatus,
  ServiceModality,
} from "@/lib/supabase/database.types";

export type ClientTableItem = {
  id: string;
  name: string;
  status: ProfileStatus;
  onboardingComplete: boolean;
  notes: string;
  modality: ServiceModality | null;
  pricingPlanId: string | null;
  pricingPlanName: string;
  billingCycle: BillingCycle | null;
  agreedAmountEur: number | null;
};

export type ClientTableSortKey = "name" | "status" | "questionnaire" | "modality" | "pricingPlan" | "amount" | "notes";
export type ClientTableSort = { key: ClientTableSortKey; direction: "asc" | "desc" } | null;
export type ClientTableFilters = {
  name: string;
  status: "all" | ProfileStatus;
  questionnaire: "all" | "complete" | "pending";
  modality: "all" | ServiceModality | "unassigned";
  pricingPlanId: "all" | "unassigned" | string;
  minAmount: string;
  maxAmount: string;
  notes: string;
};

export const emptyClientTableFilters: ClientTableFilters = {
  name: "",
  status: "all",
  questionnaire: "all",
  modality: "all",
  pricingPlanId: "all",
  minAmount: "",
  maxAmount: "",
  notes: "",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es").trim();
}

function statusLabel(item: ClientTableItem) {
  return item.status === "active" ? "Activo" : "Inactivo";
}

function questionnaireLabel(item: ClientTableItem) {
  return item.onboardingComplete ? "Completado" : "Pendiente";
}

function sortValue(item: ClientTableItem, key: ClientTableSortKey) {
  if (key === "name") return item.name;
  if (key === "status") return statusLabel(item);
  if (key === "questionnaire") return questionnaireLabel(item);
  if (key === "modality") return serviceModalityLabel(item.modality);
  if (key === "pricingPlan") return `${item.pricingPlanName} ${billingCycleLabel(item.billingCycle)}`;
  if (key === "amount") return item.agreedAmountEur == null ? "" : String(item.agreedAmountEur);
  return item.notes;
}

export function filterAndSortClients(
  clients: ClientTableItem[],
  filters: ClientTableFilters,
  sort: ClientTableSort,
) {
  const normalizedName = normalize(filters.name);
  const normalizedNotes = normalize(filters.notes);
  const minAmount = Number(filters.minAmount.replace(",", "."));
  const maxAmount = Number(filters.maxAmount.replace(",", "."));
  const hasMinAmount = filters.minAmount.trim() !== "" && Number.isFinite(minAmount);
  const hasMaxAmount = filters.maxAmount.trim() !== "" && Number.isFinite(maxAmount);
  const filtered = clients.filter((client) => {
    if (normalizedName && !normalize(client.name).includes(normalizedName)) return false;
    if (filters.status !== "all" && client.status !== filters.status) return false;
    if (filters.questionnaire === "complete" && !client.onboardingComplete) return false;
    if (filters.questionnaire === "pending" && client.onboardingComplete) return false;
    if (filters.modality === "unassigned" && client.modality !== null) return false;
    if (filters.modality !== "all" && filters.modality !== "unassigned" && client.modality !== filters.modality) return false;
    if (filters.pricingPlanId === "unassigned" && client.pricingPlanId !== null) return false;
    if (filters.pricingPlanId !== "all" && filters.pricingPlanId !== "unassigned" && client.pricingPlanId !== filters.pricingPlanId) return false;
    if (hasMinAmount && (client.agreedAmountEur == null || client.agreedAmountEur < minAmount)) return false;
    if (hasMaxAmount && (client.agreedAmountEur == null || client.agreedAmountEur > maxAmount)) return false;
    if (normalizedNotes && !normalize(client.notes).includes(normalizedNotes)) return false;
    return true;
  });

  if (!sort) return filtered;

  return [...filtered].sort((left, right) => {
    const comparison = sortValue(left, sort.key).localeCompare(
      sortValue(right, sort.key),
      "es",
      { sensitivity: "base", numeric: true },
    );
    return sort.direction === "asc" ? comparison : -comparison;
  });
}

export function nextClientTableSort(
  current: ClientTableSort,
  key: ClientTableSortKey,
): ClientTableSort {
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}
