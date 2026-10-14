import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientsTable } from "./clients-table";

vi.mock("@/app/actions/admin", () => ({
  archivePricingPlanAction: vi.fn(),
  saveClientAdminNoteAction: vi.fn(),
  saveClientCommercialQuickUpdateAction: vi.fn(),
  saveClientCommercialTermsAction: vi.fn(),
  savePricingPlanAction: vi.fn(),
  setClientStatusAction: vi.fn(),
}));

afterEach(cleanup);

const clients = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Iker Ríos",
    status: "active" as const,
    onboardingComplete: true,
    notes: "Llamar el viernes",
    modality: "in_person" as const,
    pricingPlanId: "33333333-3333-4333-8333-333333333333",
    pricingPlanName: "Mensual",
    billingCycle: "monthly" as const,
    agreedAmountEur: 60,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Bea López",
    status: "archived" as const,
    onboardingComplete: false,
    notes: "Prefiere mañanas",
    modality: "online" as const,
    pricingPlanId: null,
    pricingPlanName: "",
    billingCycle: null,
    agreedAmountEur: null,
  },
];

const pricingPlans = [{
  id: "33333333-3333-4333-8333-333333333333",
  name: "Mensual",
  billingCycle: "monthly" as const,
  durationMonths: 1,
  serviceModality: "in_person" as const,
  daysPerWeek: 3,
  defaultAmountEur: 60,
  active: true,
}];

describe("ClientsTable", () => {
  it("mantiene los filtros plegados y filtra cada columna con selectores internos", () => {
    render(<ClientsTable clients={clients} pricingPlans={pricingPlans} />);

    expect(screen.queryByPlaceholderText("Nombre…")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));
    expect(screen.getByPlaceholderText("Nombre…")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Filtrar por alta o baja" }));
    fireEvent.click(screen.getByRole("option", { name: "Inactivos" }));

    expect(screen.getByText("Bea López")).toBeInTheDocument();
    expect(screen.queryByText("Iker Ríos")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /filtros/i })).toHaveTextContent("1");
  });

  it("ofrece selectores internos por fila, notas automáticas y un menú de tres puntos", () => {
    render(<ClientsTable clients={[clients[0]]} pricingPlans={pricingPlans} />);

    expect(screen.getByRole("table")).toHaveClass("clients-table");
    expect(screen.getByRole("combobox", { name: "Modalidad de Iker Ríos" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tarifa de Iker Ríos" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /guardar nota/i })).not.toBeInTheDocument();
    expect(screen.queryByText("Guardado automático")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Notas internas" }).closest("form")).toHaveClass("w-full", "md:w-56");

    fireEvent.click(screen.getByLabelText("Más opciones para Iker Ríos"));
    expect(screen.getByRole("menu").parentElement).toBe(document.body);
    expect(screen.getByRole("menuitem", { name: /ajustar precio o crear tarifa/i })).toBeInTheDocument();
  });

  it("permite alternar la presentación entre tabla, lista y galería", () => {
    render(<ClientsTable clients={[clients[0]]} pricingPlans={pricingPlans} />);

    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Iker Ríos" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Galería" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tarifa de Iker Ríos" })).toBeInTheDocument();
  });
});
