import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DashboardKpis, type DashboardKpi } from "./dashboard-kpis";

afterEach(cleanup);

const kpis: DashboardKpi[] = [
  {
    key: "clients",
    label: "Clientes registrados",
    value: 12,
    viewAllHref: "/admin/clientes",
    hasMore: true,
    emptyMessage: "Todavía no hay clientes.",
    items: Array.from({ length: 10 }, (_, index) => ({
      id: `client-${index}`,
      title: `Cliente ${index + 1}`,
      detail: "Activo · Cuestionario completado",
      date: "13 oct 2026",
      href: `/admin/clientes/client-${index}`,
    })),
  },
  {
    key: "leads",
    label: "Interesados nuevos",
    value: 0,
    viewAllHref: "/admin/interesados",
    hasMore: false,
    emptyMessage: "Todavía no hay interesados nuevos.",
    items: [],
  },
];

describe("DashboardKpis", () => {
  it("adapta la cuadrícula antes de forzar cinco columnas y contiene textos largos", () => {
    const { container } = render(<DashboardKpis kpis={kpis} />);

    expect(container.firstElementChild).toHaveClass("xl:grid-cols-3", "2xl:grid-cols-5");
    expect(screen.getByText("Clientes registrados")).toHaveClass("break-words", "[overflow-wrap:anywhere]");
    expect(screen.getByRole("button", { name: /clientes registrados/i })).toHaveClass("min-w-0", "overflow-hidden");
  });

  it("muestra los últimos diez registros y sus destinos", () => {
    render(<DashboardKpis kpis={kpis} />);

    fireEvent.click(screen.getByRole("button", { name: /clientes registrados/i }));

    expect(screen.getByRole("dialog", { name: "Clientes registrados" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /cliente \d+/i })).toHaveLength(10);
    expect(screen.getAllByRole("link", { name: /cliente \d+/i })[0]).toHaveAttribute("href", "/admin/clientes/client-0");
    expect(screen.getByRole("link", { name: "Ver más" })).toHaveAttribute("href", "/admin/clientes");
  });

  it("permite cerrar el modal y no ofrece ver más cuando no procede", () => {
    render(<DashboardKpis kpis={kpis} />);

    fireEvent.click(screen.getByRole("button", { name: /interesados nuevos/i }));
    expect(screen.getByText("Todavía no hay interesados nuevos.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Ver más" })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
