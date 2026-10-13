import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientCommercialTermsForm, PricingPlanForm } from "./commercial-terms-forms";

vi.mock("@/app/actions/admin", () => ({
  archivePricingPlanAction: vi.fn(),
  saveClientCommercialTermsAction: vi.fn(),
  savePricingPlanAction: vi.fn(),
}));

afterEach(cleanup);

describe("formularios de condiciones comerciales", () => {
  it("usa selectores internos en modalidad, tarifa y periodicidad", () => {
    const { container } = render(
      <ClientCommercialTermsForm clientId="client-1" pricingPlans={[]} initialTerms={null} />,
    );

    expect(container.querySelector("select")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Modalidad" })).toHaveTextContent("Presencial");
    expect(screen.getByRole("combobox", { name: "Tarifa" })).toHaveTextContent("Crear una tarifa nueva");
    expect(screen.getByRole("combobox", { name: "Periodicidad" })).toHaveTextContent("Anual");

    fireEvent.click(screen.getByRole("combobox", { name: "Modalidad" }));
    fireEvent.click(screen.getByRole("option", { name: "Virtual" }));
    expect(screen.getByRole("combobox", { name: "Modalidad" })).toHaveTextContent("Virtual");
  });

  it("usa el selector interno también al administrar una tarifa", () => {
    const { container } = render(<PricingPlanForm />);

    expect(container.querySelector("select")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Modalidad de la tarifa" })).toHaveTextContent("Selecciona");
    expect(screen.getByRole("combobox", { name: "Periodicidad" })).toHaveTextContent("Mensual");
    expect(screen.getByRole("textbox", { name: "Días/semana" })).toHaveValue("");

    const amount = screen.getByRole("textbox", { name: "Precio habitual (€)" });
    fireEvent.input(amount, { target: { value: "-75,50" } });
    expect(amount).toHaveValue("75,50");
  });
});
