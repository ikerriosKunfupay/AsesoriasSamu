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
    updatedAt: "2026-10-14T08:00:00.000Z",
  },
];

describe("DashboardAnalytics", () => {
  it("abre el desglose filtrado de cobros y enlaza a la cuota", () => {
    render(
      <DashboardAnalytics
        clients={clients}
        fees={fees}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referenceDate="2026-10-14"
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
        referenceDate="2026-10-14"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /^clientes activos/i }));

    expect(screen.getByRole("link", { name: /iker ríos navarro/i })).toHaveAttribute(
      "href",
      "/admin/clientes/client-1?returnTo=%2Fadmin",
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("usa selectores internos para periodo, agrupación, modalidad y tarifa", () => {
    const { container } = render(
      <DashboardAnalytics
        clients={clients}
        fees={fees}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referenceDate="2026-10-14"
      />,
    );

    expect(container.querySelector("select")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Filtrar estadísticas por periodo" })).toHaveTextContent("Últimos 12 meses");
    expect(screen.getByRole("combobox", { name: "Agrupar estadísticas por" })).toHaveTextContent("Por mes");
    expect(screen.getByRole("combobox", { name: "Filtrar por modalidad" })).toHaveTextContent("Todas las modalidades");
    expect(screen.getByRole("combobox", { name: "Filtrar por tarifa" })).toHaveTextContent("Todas las tarifas");
    expect(container.querySelector('[aria-label="Filtros de estadísticas"]')).toHaveClass("xl:grid-cols-[13rem_11.5rem_14rem_12rem]");

    fireEvent.click(screen.getByRole("combobox", { name: "Filtrar por modalidad" }));
    fireEvent.click(screen.getByRole("option", { name: "Presencial" }));

    expect(screen.getByRole("combobox", { name: "Filtrar por modalidad" })).toHaveTextContent("Presencial");

    fireEvent.click(screen.getByRole("combobox", { name: "Agrupar estadísticas por" }));
    fireEvent.click(screen.getByRole("option", { name: "Por día" }));

    expect(screen.getByRole("combobox", { name: "Agrupar estadísticas por" })).toHaveTextContent("Por día");
    expect(screen.getByRole("combobox", { name: "Filtrar estadísticas por periodo" })).toHaveTextContent("Últimos 14 días");
    expect(screen.getByRole("button", { name: /cobrado hoy/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previsión mañana/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Filtrar estadísticas por periodo" }));
    fireEvent.click(screen.getByRole("option", { name: "Ayer" }));
    expect(screen.getByRole("button", { name: /cobrado ayer/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Filtrar estadísticas por periodo" }));
    fireEvent.click(screen.getByRole("option", { name: "Periodo personalizado" }));
    expect(screen.getByRole("button", { name: "Fecha inicial de estadísticas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fecha final de estadísticas" })).toBeInTheDocument();
    expect(screen.getByText(/limitado a los últimos doce meses/i)).toBeInTheDocument();
  });

  it("muestra los clientes activos sin cuota mensual dentro de pendientes", () => {
    render(
      <DashboardAnalytics
        clients={clients}
        fees={[]}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referenceDate="2026-10-14"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /pendiente este mes/i }));

    expect(screen.getByRole("dialog", { name: /pendiente este mes/i })).toBeInTheDocument();
    expect(screen.getByText(/^sin cuota registrada en octubre de 2026$/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iker ríos navarro/i })).toHaveAttribute("href", "/admin/cuotas");
  });

  it("elimina signos y caracteres inválidos de los objetivos mientras se escriben", () => {
    render(
      <DashboardAnalytics
        clients={clients}
        fees={fees}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referenceDate="2026-10-14"
      />,
    );

    fireEvent.click(screen.getByText("Modificar objetivos"));
    const revenueGoal = screen.getByRole("textbox", { name: "Objetivo mensual de ingresos (€)" });
    const clientsGoal = screen.getByRole("textbox", { name: "Objetivo de clientes activos" });

    fireEvent.input(revenueGoal, { target: { value: "-+?250,5e0" } });
    fireEvent.input(clientsGoal, { target: { value: "-1+2e?" } });

    expect(revenueGoal).toHaveValue("250,50");
    expect(clientsGoal).toHaveValue("12");
    expect(screen.queryByText(/las cifras son internas y orientativas/i)).not.toBeInTheDocument();
  });

  it("explica todos los conceptos de objetivos y gráficas con ayudas contextuales", () => {
    render(
      <DashboardAnalytics
        clients={clients}
        fees={fees}
        goals={{ monthlyRevenueGoalEur: 500, activeClientsGoal: 10 }}
        referenceDate="2026-10-14"
      />,
    );

    [
      "Ingresos, cartera y objetivo",
      "Objetivos",
      "Ingresos cobrados por mes",
      "Clientes activos",
      "Modificar objetivos",
      "Valor por tarifa",
      "Modalidad de servicio",
      "Altas por mes",
    ].forEach((label) => {
      expect(screen.getByRole("button", { name: `Más información sobre ${label}` })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Modificar objetivos"));
    expect(screen.getByRole("button", { name: "Más información sobre Objetivo mensual de ingresos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Más información sobre Objetivo de clientes activos" })).toBeInTheDocument();

    const chartHelp = screen.getByRole("button", { name: "Más información sobre Valor por tarifa" });
    fireEvent.mouseEnter(chartHelp.parentElement!);
    expect(screen.getByRole("tooltip")).toHaveTextContent(/reparte el precio acordado/i);
  });
});
