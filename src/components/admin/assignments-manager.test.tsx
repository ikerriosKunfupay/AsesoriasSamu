import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssignmentsManager, type AdminAssignment } from "./assignments-manager";

vi.mock("@/app/actions/admin", () => ({
  saveAssignmentAction: vi.fn(),
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
  status: index % 2 ? "draft" : "published",
  version: 1,
  startsOn: null,
  createdAt: "2026-10-14T10:00:00.000Z",
}));

describe("AssignmentsManager", () => {
  it("mantiene el histórico visible y abre la creación con un switch", () => {
    render(<AssignmentsManager kind="workout" clients={clients} assignments={assignments} />);

    const toggle = screen.getByRole("switch", { name: "Mostrar formulario para crear entrenamiento" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("heading", { name: "Nuevo entrenamiento" })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("heading", { name: "Nuevo entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Cliente del entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Estado del plan" })).toHaveTextContent("Publicado para el cliente");
  });

  it("pagina el histórico cada diez registros", () => {
    render(<AssignmentsManager kind="nutrition" clients={clients} assignments={assignments} />);

    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(screen.getByText("Plan 11")).toBeInTheDocument();
    expect(screen.queryByText("Plan 1")).not.toBeInTheDocument();
  });
});
