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
};

export type AnalyticsFilters = {
  months: 3 | 6 | 12;
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

function periodLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { month: "short", year: "2-digit", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(" ", " · ");
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

function projectNextMonth(values: number[], recurringRevenue: number) {
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
  referencePeriod,
  goals,
}: {
  clients: AnalyticsClient[];
  fees: AnalyticsFee[];
  filters: AnalyticsFilters;
  referencePeriod: string;
  goals: DashboardGoals;
}) {
  const filteredClients = filterAnalyticsClients(clients, filters);
  const clientIds = new Set(filteredClients.map((client) => client.id));
  const activeClients = filteredClients.filter((client) => client.status === "active");
  const recurringRevenue = activeClients.reduce(
    (sum, client) => sum + monthlyEquivalent(client.agreedAmountEur, client.durationMonths),
    0,
  );
  const contractedClients = activeClients.filter((client) => client.agreedAmountEur != null);
  const relevantFees = fees.filter((fee) => clientIds.has(fee.clientId));
  const periods = Array.from({ length: filters.months }, (_value, index) => (
    addMonths(referencePeriod, index - filters.months + 1)
  ));
  const revenueSeries = periods.map((period) => ({
    period,
    label: periodLabel(period),
    collected: relevantFees
      .filter((fee) => fee.period === period && fee.status === "paid")
      .reduce((sum, fee) => sum + fee.amountEur, 0),
    pending: relevantFees
      .filter((fee) => fee.period === period && fee.status === "pending")
      .reduce((sum, fee) => sum + fee.amountEur, 0),
    recurring: recurringRevenue,
    goal: goals.monthlyRevenueGoalEur,
  }));
  const current = revenueSeries.at(-1) ?? { collected: 0, pending: 0 };
  const completedMonthValues = revenueSeries.slice(0, -1).slice(-6).map((item) => item.collected);
  const nextMonthForecast = projectNextMonth(completedMonthValues, recurringRevenue);

  const planMap = new Map<string, { name: string; clients: number; monthlyValue: number }>();
  activeClients.forEach((client) => {
    const key = client.pricingPlanId ?? "unassigned";
    const currentPlan = planMap.get(key) ?? {
      name: client.pricingPlanName || "Sin tarifa",
      clients: 0,
      monthlyValue: 0,
    };
    currentPlan.clients += 1;
    currentPlan.monthlyValue += monthlyEquivalent(client.agreedAmountEur, client.durationMonths);
    planMap.set(key, currentPlan);
  });

  const modalityDistribution = [
    { key: "in_person", name: "Presencial", value: activeClients.filter((client) => client.modality === "in_person").length },
    { key: "online", name: "Virtual", value: activeClients.filter((client) => client.modality === "online").length },
    { key: "unassigned", name: "Sin asignar", value: activeClients.filter((client) => !client.modality).length },
  ].filter((item) => item.value > 0);

  const clientGrowth = periods.map((period) => ({
    period,
    label: periodLabel(period),
    newClients: filteredClients.filter((client) => client.createdAt.slice(0, 7) === period).length,
  }));

  return {
    activeClients: activeClients.length,
    currentCollected: current.collected,
    currentPending: current.pending,
    recurringRevenue,
    nextMonthForecast,
    averageTicket: contractedClients.length ? recurringRevenue / contractedClients.length : 0,
    revenueGoalProgress: goals.monthlyRevenueGoalEur > 0
      ? Math.min(100, (current.collected / goals.monthlyRevenueGoalEur) * 100)
      : 0,
    clientGoalProgress: goals.activeClientsGoal > 0
      ? Math.min(100, (activeClients.length / goals.activeClientsGoal) * 100)
      : 0,
    revenueSeries,
    planDistribution: [...planMap.values()].sort((left, right) => right.monthlyValue - left.monthlyValue),
    modalityDistribution,
    clientGrowth,
  };
}
