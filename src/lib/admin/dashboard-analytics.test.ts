import { describe, expect, it } from "vitest";
import {
  buildDashboardAnalytics,
  monthlyEquivalent,
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
  it("prorratea las tarifas por los meses que cubren", () => {
    expect(monthlyEquivalent(300, 6)).toBe(50);
    expect(monthlyEquivalent(600, 12)).toBe(50);
    expect(monthlyEquivalent(null, 1)).toBe(0);
  });

  it("calcula cobros, cartera y filtros sin mezclar modalidades", () => {
    const analytics = buildDashboardAnalytics({
      clients,
      fees: [
        { id: "f1", clientId: "1", period: "2026-10", amountEur: 60, status: "paid" },
        { id: "f2", clientId: "2", period: "2026-10", amountEur: 300, status: "pending" },
      ],
      filters: { months: 3, modality: "in_person", pricingPlanId: "all" },
      referencePeriod: "2026-10",
      goals: { monthlyRevenueGoalEur: 100, activeClientsGoal: 2 },
    });

    expect(analytics.activeClients).toBe(1);
    expect(analytics.recurringRevenue).toBe(60);
    expect(analytics.currentCollected).toBe(60);
    expect(analytics.currentPending).toBe(0);
    expect(analytics.revenueGoalProgress).toBe(60);
  });
});
