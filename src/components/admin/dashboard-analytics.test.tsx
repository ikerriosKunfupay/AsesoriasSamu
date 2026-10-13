import type { PropsWithChildren } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DashboardAnalytics } from "./dashboard-analytics";

vi.mock("@/app/actions/admin", () => ({
  saveDashboardGoalsAction: vi.fn(),
}));

vi.mock("recharts", () => {
  function MockChart({ children }: PropsWithChildren) {
    return <div>{children}</div>;
  }

  return {
    Area: MockChart,
    Bar: MockChart,
    BarChart: MockChart,
    CartesianGrid: MockChart,
    Cell: MockChart,
    ComposedChart: MockChart,
    Legend: MockChart,
    Line: MockChart,
    Pie: MockChart,
    PieChart: MockChart,
    ResponsiveContainer: MockChart,
    Tooltip: MockChart,
    XAxis: MockChart,
    YAxis: MockChart,
  };
});

afterEach(cleanup);

const clients = [
  {
    id: "client-1",
    name: "Iker Ríos Navarro",
    status: "active" as const,
    createdAt: "2026-10-01T10:00:00.000Z",
    modality: "online" as const,
    pricingPlanId: "plan-1",
    pricingPlanName: "Mensual",
    billingCycle: "monthly" as const,
    durationMonths: 1,
    agreedAmountEur: 60,
  },
];

const fees = [
  {
    id: "fee-1",
    clientId: "client-1",
    period: "2026-10",
    amountEur: 60,
    status: "paid",
  },
];

describe("DashboardAnalytics", () => {
  it("abre el desglose filtrado de cobros y enlaza a la cuota", () => {
    render(
      <DashboardAnalytics
        clients={clients}
        fees={fees}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referencePeriod="2026-10"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cobrado este mes/i }));

    expect(screen.getByRole("dialog", { name: /cobrado este mes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iker ríos navarro/i })).toHaveAttribute(
      "href",
      "/admin/cuotas#cuota-fee-1",
    );
    expect(screen.getByText(/todas las modalidades y todas las tarifas/i)).toBeInTheDocument();
  });

  it("abre clientes activos, permite ir a su ficha y cerrar con Escape", () => {
    render(
      <DashboardAnalytics
        clients={clients}
        fees={fees}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referencePeriod="2026-10"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /clientes activos/i }));

    expect(screen.getByRole("link", { name: /iker ríos navarro/i })).toHaveAttribute(
      "href",
      "/admin/clientes/client-1?returnTo=%2Fadmin",
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
