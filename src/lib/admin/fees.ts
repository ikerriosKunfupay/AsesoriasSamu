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
  query: string;
  period: string;
  status: "all" | FeeStatus;
  minAmount: string;
  maxAmount: string;
};

export const emptyFeeFilters: FeeFilters = {
  query: "",
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

export function filterFees(fees: AdminFee[], filters: FeeFilters) {
  const query = normalize(filters.query);
  const minAmount = numericFilter(filters.minAmount);
  const maxAmount = numericFilter(filters.maxAmount);

  return fees.filter((fee) => (
    (!query || normalize(`${fee.clientName} ${fee.period} ${fee.notes}`).includes(query))
    && (!filters.period || fee.period === filters.period)
    && (filters.status === "all" || fee.status === filters.status)
    && (minAmount === null || fee.amountEur >= minAmount)
    && (maxAmount === null || fee.amountEur <= maxAmount)
  ));
}
