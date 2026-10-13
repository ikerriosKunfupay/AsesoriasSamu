import type {
  BillingCycle,
  ProfileStatus,
  ServiceModality,
} from "@/lib/supabase/database.types";

export type AnalyticsClient = {
  id: string;
  name: string;
  status: ProfileStatus;
  createdAt: string;
  modality: ServiceModality | null;
  pricingPlanId: string | null;
  pricingPlanName: string;
  billingCycle: BillingCycle | null;
  durationMonths: number | null;
  agreedAmountEur: number | null;
};

export type AnalyticsFee = {
  id: string;
  clientId: string;
  period: string;
  amountEur: number;
  status: string;
  updatedAt: string;
};

export type AnalyticsGranularity = "day" | "week" | "month";

export type AnalyticsFilters = {
  granularity: AnalyticsGranularity;
  modality: "all" | ServiceModality;
  pricingPlanId: "all" | "unassigned" | string;
};

export type DashboardGoals = {
  monthlyRevenueGoalEur: number;
  activeClientsGoal: number;
};

function addMonths(period: string, offset: number) {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { month: "short", year: "2-digit", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(" ", " · ");
}

function dateFromKey(dateKey: string) {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function addDays(date: string, offset: number) {
  const value = dateFromKey(date);
  value.setUTCDate(value.getUTCDate() + offset);
  return dateKey(value);
}

function startOfWeek(date: string) {
  const value = dateFromKey(date);
  const day = value.getUTCDay() || 7;
  return addDays(date, 1 - day);
}

function localDateKey(value: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

function shortDateLabel(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(dateFromKey(date));
}

function periodLabel(period: string, granularity: AnalyticsGranularity) {
  if (granularity === "month") return monthLabel(period);
  if (granularity === "week") return `${shortDateLabel(period)}–${shortDateLabel(addDays(period, 6))}`;
  return shortDateLabel(period);
}

function longPeriodLabel(period: string, granularity: AnalyticsGranularity) {
  if (granularity === "month") {
    const [year, month] = period.split("-").map(Number);
    return new Intl.DateTimeFormat("es-ES", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, 1)));
  }
  if (granularity === "week") {
    return `semana del ${shortDateLabel(period)} al ${shortDateLabel(addDays(period, 6))}`;
  }
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateFromKey(period));
}

function buildPeriods(referenceDate: string, granularity: AnalyticsGranularity) {
  if (granularity === "day") {
    return Array.from({ length: 14 }, (_value, index) => addDays(referenceDate, index - 13));
  }
  if (granularity === "week") {
    const currentWeek = startOfWeek(referenceDate);
    return Array.from({ length: 12 }, (_value, index) => addDays(currentWeek, (index - 11) * 7));
  }
  const referenceMonth = referenceDate.slice(0, 7);
  return Array.from({ length: 12 }, (_value, index) => addMonths(referenceMonth, index - 11));
}

function periodEquivalent(monthlyAmount: number, granularity: AnalyticsGranularity) {
  if (granularity === "day") return (monthlyAmount * 12) / 365;
  if (granularity === "week") return (monthlyAmount * 12) / 52;
  return monthlyAmount;
}

function feePeriod(fee: AnalyticsFee, granularity: AnalyticsGranularity) {
  if (granularity === "month") return fee.period;
  const feeDate = localDateKey(fee.updatedAt);
  return granularity === "week" ? startOfWeek(feeDate) : feeDate;
}

function clientPeriod(createdAt: string, granularity: AnalyticsGranularity) {
  const createdDate = localDateKey(createdAt);
  if (granularity === "month") return createdDate.slice(0, 7);
  return granularity === "week" ? startOfWeek(createdDate) : createdDate;
}

function rangeDescription(granularity: AnalyticsGranularity) {
  if (granularity === "day") return "últimos 14 días";
  if (granularity === "week") return "últimas 12 semanas";
  return "últimos 12 meses";
}

export function monthlyEquivalent(amount: number | null, durationMonths: number | null) {
  if (amount == null || !durationMonths || durationMonths < 1) return 0;
  return amount / durationMonths;
}

export function filterAnalyticsClients(clients: AnalyticsClient[], filters: AnalyticsFilters) {
  return clients.filter((client) => {
    if (filters.modality !== "all" && client.modality !== filters.modality) return false;
    if (filters.pricingPlanId === "unassigned" && client.pricingPlanId) return false;
    if (
      filters.pricingPlanId !== "all"
      && filters.pricingPlanId !== "unassigned"
      && client.pricingPlanId !== filters.pricingPlanId
    ) return false;
    return true;
  });
}

function projectNextPeriod(values: number[], recurringRevenue: number) {
  if (values.length < 2 || values.every((value) => value === 0)) return recurringRevenue;
  const meanX = (values.length - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / values.length;
  const numerator = values.reduce((sum, value, index) => sum + ((index - meanX) * (value - meanY)), 0);
  const denominator = values.reduce((sum, _value, index) => sum + ((index - meanX) ** 2), 0);
  const trendProjection = Math.max(0, meanY + ((numerator / denominator) * (values.length - meanX)));
  return recurringRevenue > 0 ? (trendProjection + recurringRevenue) / 2 : trendProjection;
}

export function buildDashboardAnalytics({
  clients,
  fees,
  filters,
  referenceDate,
  goals,
}: {
  clients: AnalyticsClient[];
  fees: AnalyticsFee[];
  filters: AnalyticsFilters;
  referenceDate: string;
  goals: DashboardGoals;
}) {
  const filteredClients = filterAnalyticsClients(clients, filters);
  const clientIds = new Set(filteredClients.map((client) => client.id));
  const activeClients = filteredClients.filter((client) => client.status === "active");
  const monthlyRecurringRevenue = activeClients.reduce(
    (sum, client) => sum + monthlyEquivalent(client.agreedAmountEur, client.durationMonths),
    0,
  );
  const recurringRevenue = periodEquivalent(monthlyRecurringRevenue, filters.granularity);
  const contractedClients = activeClients.filter((client) => client.agreedAmountEur != null);
  const relevantFees = fees.filter((fee) => clientIds.has(fee.clientId));
  const periods = buildPeriods(referenceDate, filters.granularity);
  const revenueSeries = periods.map((period) => ({
    period,
    label: periodLabel(period, filters.granularity),
    collected: relevantFees
      .filter((fee) => feePeriod(fee, filters.granularity) === period && fee.status === "paid")
      .reduce((sum, fee) => sum + fee.amountEur, 0),
    pending: relevantFees
      .filter((fee) => feePeriod(fee, filters.granularity) === period && fee.status === "pending")
      .reduce((sum, fee) => sum + fee.amountEur, 0),
    recurring: recurringRevenue,
    goal: periodEquivalent(goals.monthlyRevenueGoalEur, filters.granularity),
  }));
  const current = revenueSeries.at(-1) ?? { collected: 0, pending: 0 };
  const completedPeriodValues = revenueSeries.slice(0, -1).slice(-6).map((item) => item.collected);
  const nextPeriodForecast = projectNextPeriod(completedPeriodValues, recurringRevenue);
  const currentPeriod = periods.at(-1) ?? referenceDate;
  const currentFeeIds = relevantFees
    .filter((fee) => feePeriod(fee, filters.granularity) === currentPeriod)
    .map((fee) => fee.id);

  const planMap = new Map<string, { name: string; clients: number; periodValue: number }>();
  activeClients.forEach((client) => {
    const key = client.pricingPlanId ?? "unassigned";
    const currentPlan = planMap.get(key) ?? {
      name: client.pricingPlanName || "Sin tarifa",
      clients: 0,
      periodValue: 0,
    };
    currentPlan.clients += 1;
    currentPlan.periodValue += periodEquivalent(
      monthlyEquivalent(client.agreedAmountEur, client.durationMonths),
      filters.granularity,
    );
    planMap.set(key, currentPlan);
  });

  const modalityDistribution = [
    { key: "in_person", name: "Presencial", value: activeClients.filter((client) => client.modality === "in_person").length },
    { key: "online", name: "Virtual", value: activeClients.filter((client) => client.modality === "online").length },
    { key: "unassigned", name: "Sin asignar", value: activeClients.filter((client) => !client.modality).length },
  ].filter((item) => item.value > 0);

  const clientGrowth = periods.map((period) => ({
    period,
    label: periodLabel(period, filters.granularity),
    newClients: filteredClients.filter((client) => clientPeriod(client.createdAt, filters.granularity) === period).length,
  }));

  const currentRevenueGoal = periodEquivalent(goals.monthlyRevenueGoalEur, filters.granularity);

  return {
    activeClients: activeClients.length,
    currentCollected: current.collected,
    currentPending: current.pending,
    recurringRevenue,
    monthlyRecurringRevenue,
    nextPeriodForecast,
    averageTicket: contractedClients.length ? recurringRevenue / contractedClients.length : 0,
    currentRevenueGoal,
    currentPeriod,
    currentPeriodLabel: longPeriodLabel(currentPeriod, filters.granularity),
    currentFeeIds,
    rangeDescription: rangeDescription(filters.granularity),
    revenueGoalProgress: currentRevenueGoal > 0
      ? Math.min(100, (current.collected / currentRevenueGoal) * 100)
      : 0,
    clientGoalProgress: goals.activeClientsGoal > 0
      ? Math.min(100, (activeClients.length / goals.activeClientsGoal) * 100)
      : 0,
    revenueSeries,
    planDistribution: [...planMap.values()].sort((left, right) => right.periodValue - left.periodValue),
    modalityDistribution,
    clientGrowth,
  };
}
