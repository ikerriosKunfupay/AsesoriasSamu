import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PricingPlansCatalog } from "./pricing-plans-catalog";

vi.mock("@/app/actions/admin", () => ({
  archivePricingPlanAction: vi.fn(),
  savePricingPlanAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

const plans = [{
  id: "33333333-3333-4333-8333-333333333333",
  name: "Mensual",
  billingCycle: "monthly" as const,
  durationMonths: 1,
  serviceModality: "in_person" as const,
  daysPerWeek: 3,
  defaultAmountEur: 60,
  active: true,
}];

describe("PricingPlansCatalog", () => {
  it("alterna entre tabla, lista y galería y recuerda la vista", () => {
    render(<PricingPlansCatalog plans={plans} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText(/presencial/i)).toHaveTextContent("3 días/semana");
    expect(window.localStorage.getItem("team-ortega:pricing-plans-view")).toBe("list");

    fireEvent.click(screen.getByRole("button", { name: "Galería" }));
    expect(screen.getByRole("button", { name: "Galería" })).toHaveAttribute("aria-pressed", "true");
  });

  it("abre la edición compartida desde cualquier vista", () => {
    render(<PricingPlansCatalog plans={plans} />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Mensual, Presencial" }));
    expect(screen.getByRole("dialog", { name: "Mensual" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Modalidad de la tarifa" })).toHaveTextContent("Presencial");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar edición de tarifa" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
