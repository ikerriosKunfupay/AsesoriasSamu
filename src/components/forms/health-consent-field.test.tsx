import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HealthConsentField } from "./health-consent-field";

afterEach(cleanup);

describe("HealthConsentField", () => {
  it("marca el consentimiento en rojo y expone el error de forma accesible", () => {
    render(<HealthConsentField error="Debes aceptar el tratamiento de datos de salud." />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("aria-describedby", "healthConsent-error");
    expect(checkbox).toHaveClass("outline-danger");
    expect(checkbox.closest("label")).toHaveClass("border-danger", "bg-danger-soft");
    expect(screen.getByText("Debes aceptar el tratamiento de datos de salud.")).toHaveClass("sr-only");
  });
});
