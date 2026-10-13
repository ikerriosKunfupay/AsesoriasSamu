import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OnboardingForm } from "./client-forms";

vi.mock("@/app/actions/client", () => ({
  createCheckInAction: vi.fn(),
  saveOnboardingAction: vi.fn(),
}));

afterEach(cleanup);

describe("OnboardingForm", () => {
  it("estructura el cuestionario en bloques y alinea los datos físicos en dos columnas", () => {
    render(<OnboardingForm />);

    expect(screen.getByRole("heading", { name: "Datos físicos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rutina y disponibilidad" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alimentación y objetivos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Salud y necesidades específicas" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Información adicional y consentimiento" }),
    ).toBeInTheDocument();

    const physicalSection = screen.getByRole("heading", { name: "Datos físicos" }).closest("section");
    expect(physicalSection).not.toBeNull();
    expect(within(physicalSection!).getByRole("textbox", { name: "Edad" })).toBeInTheDocument();
    expect(within(physicalSection!).getByRole("combobox", { name: "Sexo" })).toBeInTheDocument();
    expect(within(physicalSection!).getByRole("textbox", { name: "Peso en ayunas (kg)" })).toBeInTheDocument();
    expect(within(physicalSection!).getByRole("textbox", { name: "Altura (cm o m)" })).toHaveAttribute(
      "aria-describedby",
      "heightCm-help",
    );
    expect(physicalSection?.querySelector(".sm\\:grid-cols-2")).toBeInTheDocument();
    expect(physicalSection?.querySelector(".xl\\:grid-cols-4")).not.toBeInTheDocument();
  });
});
