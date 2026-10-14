import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdminAssignment } from "@/lib/admin/assignments";
import { AssignmentsManager } from "./assignments-manager";

vi.mock("@/app/actions/admin", () => ({
  deleteAssignmentAction: vi.fn(),
  saveAssignmentAction: vi.fn(),
  updateAssignmentAction: vi.fn(),
}));

afterEach(cleanup);

const clients = Array.from({ length: 11 }, (_, index) => ({
  id: `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`,
  full_name: `Cliente ${index + 1}`,
}));

const assignments: AdminAssignment[] = clients.map((client, index) => ({
  id: `22222222-2222-4222-8222-${String(index).padStart(12, "0")}`,
  clientId: client.id,
  clientName: client.full_name,
  title: `Plan ${index + 1}`,
  content: `Contenido completo del plan ${index + 1} con suficiente detalle.`,
  status: index % 2 ? "draft" : "published",
  startsOn: null,
  createdAt: "2026-10-14T10:00:00.000Z",
}));

const templates = [{ id: "33333333-3333-4333-8333-333333333333", name: "Base fuerza", title: "Fuerza base", content: "Contenido reutilizable de fuerza con suficiente detalle." }];

describe("AssignmentsManager", () => {
  it("mantiene el histórico visible y abre la creación con un switch", () => {
    render(<AssignmentsManager kind="workout" clients={clients} assignments={assignments} templates={templates} />);

    const toggle = screen.getByRole("switch", { name: "Mostrar formulario para crear entrenamiento" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("heading", { name: "Nuevo entrenamiento" })).not.toBeInTheDocument();
    expect(screen.queryByText("Hasta 10 registros por página.")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("heading", { name: "Nuevo entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Cliente del entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Plantilla de entrenamiento" })).toHaveTextContent("Empezar desde cero");
    expect(screen.getByRole("combobox", { name: "Estado del plan" })).toHaveTextContent("Publicado para el cliente");
    expect(screen.queryByText(/puedes usar saltos/i)).not.toBeInTheDocument();
    expect(document.querySelector('input[type="date"]')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Plantilla de entrenamiento" }));
    fireEvent.click(screen.getByRole("option", { name: "Base fuerza" }));
    expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue("Fuerza base");
    expect(screen.getByRole("textbox", { name: "Contenido del plan" })).toHaveValue(templates[0].content);
  });

  it("pagina el histórico cada diez registros", () => {
    render(<AssignmentsManager kind="nutrition" clients={clients} assignments={assignments} />);

    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(screen.getByText("Plan 11")).toBeInTheDocument();
    expect(screen.queryByText("Plan 1")).not.toBeInTheDocument();
  });

  it("permite filtrar y ordenar todas las columnas visibles", () => {
    render(<AssignmentsManager kind="workout" clients={clients} assignments={assignments} />);

    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));
    fireEvent.change(screen.getByPlaceholderText("Título…"), { target: { value: "Plan 2" } });
    expect(screen.getByText("Plan 2")).toBeInTheDocument();
    expect(screen.queryByText("Plan 1")).not.toBeInTheDocument();
    expect(screen.getByText("1 de 11")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Restablecer" }));
    fireEvent.click(screen.getByRole("button", { name: "Ordenar Plan en orden ascendente" }));
    fireEvent.click(screen.getByRole("button", { name: "Ordenar Plan en orden descendente" }));
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Plan 11");
  });

  it("abre la lectura completa, la edición y la confirmación de eliminación sin mostrar versión", () => {
    render(<AssignmentsManager kind="workout" clients={clients.slice(0, 1)} assignments={assignments.slice(0, 1)} />);

    expect(screen.queryByText("Versión")).not.toBeInTheDocument();
    expect(screen.queryByText("v1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver entrenamiento Plan 1" }));
    expect(screen.getByRole("dialog", { name: "Plan 1" })).toHaveTextContent("Contenido completo del plan 1");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar plan" }));

    fireEvent.click(screen.getByRole("button", { name: "Editar entrenamiento Plan 1" }));
    expect(screen.getByRole("dialog", { name: "Plan 1" })).toHaveTextContent("Actualizar plan");
    expect(screen.getByRole("textbox", { name: "Contenido del plan" })).toHaveValue(assignments[0].content);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar edición del plan" }));

    fireEvent.click(screen.getByRole("button", { name: "Eliminar entrenamiento Plan 1" }));
    expect(screen.getByRole("alertdialog", { name: "Eliminar entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar plan" })).toBeInTheDocument();
  });

  it("conserva lectura y acciones en las vistas lista y galería", () => {
    render(<AssignmentsManager kind="nutrition" clients={clients.slice(0, 1)} assignments={assignments.slice(0, 1)} />);

    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver pauta nutricional Plan 1" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Galería" }));
    expect(screen.getByText(/Contenido completo del plan 1/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar pauta nutricional Plan 1" })).toBeInTheDocument();
  });
});
