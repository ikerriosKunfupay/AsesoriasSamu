import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientAdminNotesForm, ClientStatusSwitch } from "./admin-forms";

vi.mock("@/app/actions/admin", () => ({
  inviteClientAction: vi.fn(),
  saveAssignmentAction: vi.fn(),
  saveClientAdminNoteAction: vi.fn(),
  saveFeeAction: vi.fn(),
  setClientStatusAction: vi.fn(),
}));

afterEach(cleanup);

describe("ClientStatusSwitch", () => {
  it("mantiene el indicador dentro de la pista sin invadir el texto activo", () => {
    render(<ClientStatusSwitch clientId="client-1" clientName="Iker Ríos" status="active" />);

    const control = screen.getByRole("switch", { name: "Dar de baja a Iker Ríos" });
    const track = control.querySelector<HTMLElement>("[aria-hidden='true']");
    const thumb = track?.firstElementChild;

    expect(control).toHaveClass("whitespace-nowrap");
    expect(track).toHaveClass("shrink-0");
    expect(thumb).toHaveClass("left-1", "translate-x-5");
    expect(control).toHaveTextContent("Activo");
  });

  it("muestra la nota compacta sin texto auxiliar ni botón", () => {
    render(<ClientAdminNotesForm clientId="client-1" initialNotes="Llamar el viernes" compact />);

    expect(screen.getByDisplayValue("Llamar el viernes")).toHaveClass("min-h-10");
    expect(screen.queryByText("Guardado automático")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /guardar nota/i })).not.toBeInTheDocument();
  });

  it("omite la explicación administrativa en la ficha y conserva el estado de autoguardado", () => {
    render(<ClientAdminNotesForm clientId="client-1" initialNotes="Llamar el viernes" />);

    const status = screen.getByText("Los cambios se guardan automáticamente.");

    expect(screen.queryByText(/solo lo verá la administración/i)).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Notas internas" })).toHaveAttribute("aria-describedby", status.id);
  });
});
