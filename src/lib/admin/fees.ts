export type FeeStatus = "pending" | "paid" | "waived";

export type AdminFee = {
  id: string;
  clientId: string;
  clientName: string;
  period: string;
  amountEur: number;
  status: FeeStatus;
  notes: string;
};

export type FeeFilters = {
  client: string;
  notes: string;
  period: string;
  status: "all" | FeeStatus;
  minAmount: string;
  maxAmount: string;
};

export const emptyFeeFilters: FeeFilters = {
  client: "",
  notes: "",
  period: "",
  status: "all",
  minAmount: "",
  maxAmount: "",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function numericFilter(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export type FeeSortKey = "period" | "client" | "amount" | "status" | "notes";
export type FeeSort = { key: FeeSortKey; direction: "asc" | "desc" } | null;

export function filterAndSortFees(fees: AdminFee[], filters: FeeFilters, sort: FeeSort) {
  const client = normalize(filters.client);
  const notes = normalize(filters.notes);
  const minAmount = numericFilter(filters.minAmount);
  const maxAmount = numericFilter(filters.maxAmount);

  const filtered = fees.filter((fee) => (
    (!client || normalize(fee.clientName).includes(client))
    && (!notes || normalize(fee.notes).includes(notes))
    && (!filters.period || fee.period === filters.period)
    && (filters.status === "all" || fee.status === filters.status)
    && (minAmount === null || fee.amountEur >= minAmount)
    && (maxAmount === null || fee.amountEur <= maxAmount)
  ));

  if (!sort) return filtered;

  return [...filtered].sort((left, right) => {
    const comparison = sort.key === "amount"
      ? left.amountEur - right.amountEur
      : ({
        period: left.period.localeCompare(right.period, "es", { numeric: true }),
        client: left.clientName.localeCompare(right.clientName, "es", { sensitivity: "base", numeric: true }),
        status: left.status.localeCompare(right.status, "es"),
        notes: left.notes.localeCompare(right.notes, "es", { sensitivity: "base", numeric: true }),
      } as const)[sort.key];
    return sort.direction === "asc" ? comparison : -comparison;
  });
}

export function nextFeeSort(current: FeeSort, key: FeeSortKey): FeeSort {
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}
