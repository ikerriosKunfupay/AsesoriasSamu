import { describe, expect, it } from "vitest";
import {
  buildDashboardAnalytics,
  inferAnalyticsGranularity,
  monthlyEquivalent,
  resolveAnalyticsDateRange,
  type AnalyticsClient,
} from "./dashboard-analytics";

const clients: AnalyticsClient[] = [
  {
    id: "1",
    name: "Cliente presencial",
    status: "active",
    createdAt: "2026-08-12T10:00:00.000Z",
    modality: "in_person",
    pricingPlanId: "monthly",
    pricingPlanName: "Mensual",
    billingCycle: "monthly",
    durationMonths: 1,
    agreedAmountEur: 60,
  },
  {
    id: "2",
    name: "Cliente virtual",
    status: "active",
    createdAt: "2026-09-12T10:00:00.000Z",
    modality: "online",
    pricingPlanId: "semiannual",
    pricingPlanName: "Semestral",
    billingCycle: "semiannual",
    durationMonths: 6,
    agreedAmountEur: 300,
  },
];

describe("analítica del panel", () => {
  it("deduce la agrupación a partir del único periodo visible", () => {
    expect(inferAnalyticsGranularity("today")).toBe("day");
    expect(inferAnalyticsGranularity("last_week")).toBe("week");
    expect(inferAnalyticsGranularity("this_month")).toBe("month");
    expect(inferAnalyticsGranularity("custom", "2026-10-01", "2026-10-20")).toBe("day");
    expect(inferAnalyticsGranularity("custom", "2026-06-01", "2026-10-14")).toBe("month");
  });

  it("prorratea las tarifas por los meses que cubren", () => {
    expect(monthlyEquivalent(300, 6)).toBe(50);
    expect(monthlyEquivalent(600, 12)).toBe(50);
    expect(monthlyEquivalent(null, 1)).toBe(0);
  });

  it("calcula cobros, cartera y filtros sin mezclar modalidades", () => {
    const analytics = buildDashboardAnalytics({
      clients,
      fees: [
        { id: "f1", clientId: "1", period: "2026-10", amountEur: 60, status: "paid", updatedAt: "2026-10-14T08:00:00.000Z" },
        { id: "f2", clientId: "2", period: "2026-10", amountEur: 300, status: "pending", updatedAt: "2026-10-13T08:00:00.000Z" },
      ],
      filters: { granularity: "month", modality: "in_person", pricingPlanId: "all" },
      referenceDate: "2026-10-14",
      goals: { monthlyRevenueGoalEur: 100, activeClientsGoal: 2 },
    });

    expect(analytics.activeClients).toBe(1);
    expect(analytics.recurringRevenue).toBe(60);
    expect(analytics.currentCollected).toBe(60);
    expect(analytics.currentPending).toBe(0);
    expect(analytics.revenueGoalProgress).toBe(60);
  });

  it("agrupa los cobros por día, semana o mes y prorratea cartera y objetivo", () => {
    const fees = [
      { id: "f1", clientId: "1", period: "2026-10", amountEur: 60, status: "paid", updatedAt: "2026-10-14T08:00:00.000Z" },
      { id: "f2", clientId: "2", period: "2026-10", amountEur: 300, status: "paid", updatedAt: "2026-10-13T08:00:00.000Z" },
    ];
    const base = {
      clients,
      fees,
      referenceDate: "2026-10-14",
      goals: { monthlyRevenueGoalEur: 520, activeClientsGoal: 2 },
    };

    const daily = buildDashboardAnalytics({
      ...base,
      filters: { granularity: "day", modality: "all", pricingPlanId: "all" },
    });
    const weekly = buildDashboardAnalytics({
      ...base,
      filters: { granularity: "week", modality: "all", pricingPlanId: "all" },
    });
    const monthly = buildDashboardAnalytics({
      ...base,
      filters: { granularity: "month", modality: "all", pricingPlanId: "all" },
    });

    expect(daily.revenueSeries).toHaveLength(14);
    expect(daily.currentCollected).toBe(60);
    expect(daily.recurringRevenue).toBeCloseTo((110 * 12) / 365);
    expect(weekly.revenueSeries).toHaveLength(12);
    expect(weekly.currentCollected).toBe(360);
    expect(weekly.currentRevenueGoal).toBe(120);
    expect(monthly.revenueSeries).toHaveLength(12);
    expect(monthly.currentCollected).toBe(360);
    expect(monthly.recurringRevenue).toBe(110);
  });

  it("resuelve rangos rápidos y personalizados dentro de un máximo de doce meses", () => {
    const base = { granularity: "day" as const, modality: "all" as const, pricingPlanId: "all" as const };

    expect(resolveAnalyticsDateRange({ ...base, range: "yesterday" }, "2026-10-14")).toEqual({ start: "2026-10-13", end: "2026-10-13" });
    expect(resolveAnalyticsDateRange({ ...base, range: "last_week" }, "2026-10-14")).toEqual({ start: "2026-10-05", end: "2026-10-11" });
    expect(resolveAnalyticsDateRange({ ...base, range: "last_3_months" }, "2026-10-14")).toEqual({ start: "2026-08-01", end: "2026-10-14" });
    expect(resolveAnalyticsDateRange({ ...base, range: "custom", customStart: "2020-01-01", customEnd: "2026-10-10" }, "2026-10-14")).toEqual({ start: "2025-10-14", end: "2026-10-10" });
  });

  it("aplica ayer y semana pasada a todas las series temporales", () => {
    const base = {
      clients,
      fees: [
        { id: "f1", clientId: "1", period: "2026-10", amountEur: 60, status: "paid", updatedAt: "2026-10-13T08:00:00.000Z" },
        { id: "f2", clientId: "2", period: "2026-10", amountEur: 300, status: "paid", updatedAt: "2026-10-05T08:00:00.000Z" },
      ],
      referenceDate: "2026-10-14",
      goals: { monthlyRevenueGoalEur: 520, activeClientsGoal: 2 },
    };
    const yesterday = buildDashboardAnalytics({ ...base, filters: { granularity: "day", modality: "all", pricingPlanId: "all", range: "yesterday" } });
    const lastWeek = buildDashboardAnalytics({ ...base, filters: { granularity: "week", modality: "all", pricingPlanId: "all", range: "last_week" } });

    expect(yesterday.revenueSeries).toHaveLength(1);
    expect(yesterday.currentCollected).toBe(60);
    expect(yesterday.clientGrowth).toHaveLength(1);
    expect(lastWeek.revenueSeries).toHaveLength(1);
    expect(lastWeek.currentCollected).toBe(300);
    expect(lastWeek.rangeDescription).toBe("la semana pasada");
  });
});
