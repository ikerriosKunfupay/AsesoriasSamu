import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/auth", () => ({
  logoutAction: vi.fn(),
}));

import { DashboardShell } from "./dashboard-shell";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("DashboardShell", () => {
  it("avisa y bloquea el resto del área cuando el cuestionario está pendiente", () => {
    render(
      <DashboardShell mode="client" userName="Cliente de prueba" onboardingComplete={false}>
        <p>Cuestionario</p>
      </DashboardShell>,
    );

    fireEvent.click(screen.getAllByRole("link", { name: "Entrenamiento" })[0]);

    expect(screen.getByRole("dialog", { name: "Completa primero tu cuestionario" })).toBeInTheDocument();
    expect(screen.getByText(/cuando lo guardes, podrás moverte libremente/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
    expect(screen.queryByRole("dialog", { name: "Completa primero tu cuestionario" })).not.toBeInTheDocument();
  });

  it("no bloquea la navegación cuando el cuestionario ya está completo", () => {
    render(
      <DashboardShell mode="client" userName="Cliente de prueba" onboardingComplete>
        <p>Inicio</p>
      </DashboardShell>,
    );

    const trainingLink = screen.getAllByRole("link", { name: "Entrenamiento" })[0];
    expect(trainingLink).toHaveAttribute("href", "/app/entrenamiento");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("permite ocultar y volver a mostrar el menú lateral", () => {
    render(
      <DashboardShell mode="admin" userName="Administración">
        <p>Resumen</p>
      </DashboardShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ocultar menú lateral" }));
    expect(screen.queryByRole("button", { name: "Ocultar menú lateral" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mostrar menú lateral" })).toBeInTheDocument();
    expect(window.localStorage.getItem("team-ortega:sidebar-open")).toBe("false");

    fireEvent.click(screen.getByRole("button", { name: "Mostrar menú lateral" }));
    expect(screen.getByRole("button", { name: "Ocultar menú lateral" })).toBeInTheDocument();
    expect(window.localStorage.getItem("team-ortega:sidebar-open")).toBe("true");
  });
});
