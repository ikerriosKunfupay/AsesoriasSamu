import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
  pathname: "/admin",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMocks.pathname,
}));

vi.mock("@/app/actions/auth", () => ({
  logoutAction: vi.fn(),
}));

import { DashboardShell } from "./dashboard-shell";

afterEach(() => {
  cleanup();
  navigationMocks.pathname = "/admin";
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
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

  it("alterna y recuerda el modo claro u oscuro", () => {
    document.documentElement.dataset.theme = "light";
    render(
      <DashboardShell mode="admin" userName="Administración">
        <p>Resumen</p>
      </DashboardShell>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Activar modo oscuro" })[0]);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem("team-ortega:theme")).toBe("dark");

    fireEvent.click(screen.getAllByRole("button", { name: "Activar modo claro" })[0]);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("team-ortega:theme")).toBe("light");
  });

  it("usa colores temáticos en el menú lateral", () => {
    render(
      <DashboardShell mode="admin" userName="Administración">
        <p>Resumen</p>
      </DashboardShell>,
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("bg-sidebar", "text-sidebar-foreground", "border-sidebar-border");
    expect(sidebar).not.toHaveClass("bg-surface-inverse", "text-white");
    expect(screen.getAllByRole("link", { name: "Resumen" })[0]).toHaveClass("bg-sidebar-hover", "text-sidebar-foreground");
    expect(screen.getByRole("main")).toHaveClass("px-4", "sm:px-6", "lg:px-10", "xl:px-12");
  });

  it("remarca la sección actual en escritorio y móvil, también en rutas internas", () => {
    navigationMocks.pathname = "/admin/clientes/client-1";

    render(
      <DashboardShell mode="admin" userName="Administración">
        <p>Ficha del cliente</p>
      </DashboardShell>,
    );

    const activeLinks = screen.getAllByRole("link", { name: "Clientes", current: "page" });
    expect(activeLinks).toHaveLength(2);
    expect(activeLinks[0]).toHaveClass("bg-sidebar-hover", "text-sidebar-foreground");
    expect(activeLinks[1]).toHaveClass("bg-surface-muted", "text-foreground");
    expect(screen.getAllByRole("link", { name: "Resumen" })[0]).not.toHaveAttribute("aria-current");
  });

  it("agrupa el menú administrativo en asesorías y pagos", () => {
    render(
      <DashboardShell mode="admin" userName="Administración">
        <p>Resumen</p>
      </DashboardShell>,
    );

    const navigation = screen.getByRole("navigation", { name: "Administración" });
    expect(screen.getAllByText("Asesorías")).toHaveLength(2);
    expect(screen.getAllByText("Pagos")).toHaveLength(2);
    expect(navigation.textContent?.indexOf("Interesados")).toBeLessThan(navigation.textContent?.indexOf("Asesorías") ?? 0);
    expect(navigation.textContent?.indexOf("Clientes")).toBeLessThan(navigation.textContent?.indexOf("Pagos") ?? 0);
    expect(navigation).toHaveTextContent(/Tarifas\s*Cuotas/);
  });
});
