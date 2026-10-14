import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdminFee } from "@/lib/admin/fees";
import { FeesManager } from "./fees-manager";

vi.mock("@/app/actions/admin", () => ({
  deleteFeeAction: vi.fn(),
  saveFeeAction: vi.fn(),
  saveFeeNoteAction: vi.fn(),
  updateFeeAction: vi.fn(),
}));

afterEach(cleanup);

const clients = Array.from({ length: 11 }, (_, index) => ({
  id: `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`,
  full_name: `Cliente ${index + 1}`,
}));

const fees: AdminFee[] = clients.map((client, index) => ({
  id: `22222222-2222-4222-8222-${String(index).padStart(12, "0")}`,
  clientId: client.id,
  clientName: client.full_name,
  period: index % 2 ? "2026-09" : "2026-10",
  amountEur: 50 + index,
  status: index % 2 ? "pending" : "paid",
  notes: index === 0 ? "Transferencia" : "",
}));

describe("FeesManager", () => {
  it("muestra solo la tabla hasta activar el formulario", () => {
    render(<FeesManager clients={clients} fees={fees} />);

    const toggle = screen.getByRole("switch", { name: "Mostrar formulario para registrar cuota" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("heading", { name: "Registrar cuota" })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("heading", { name: "Registrar cuota" })).toBeInTheDocument();
    expect(screen.queryByText("Este registro es solo de control interno. La aplicación no procesa cobros.")).not.toBeInTheDocument();
  });

  it("pagina de diez en diez y filtra la tabla", () => {
    render(<FeesManager clients={clients} fees={fees} />);

    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(screen.getByText("Cliente 11")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Filtrar por cliente" }), { target: { value: "Cliente 2" } });
    expect(screen.getByText("1 cuota")).toBeInTheDocument();
    expect(screen.getByText("Cliente 2")).toBeInTheDocument();
    expect(screen.queryByText("1 de 2")).not.toBeInTheDocument();
  });

  it("alterna entre tabla, lista y galería y muestra la nota editable", () => {
    render(<FeesManager clients={clients} fees={[fees[0]]} />);

    expect(screen.getByRole("textbox", { name: "Nota interna de Cliente 1, 2026-10" })).toHaveValue("Transferencia");
    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("Cliente 1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Galería" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText(/50,00/)).toBeInTheDocument();
  });

  it("abre la edición y exige confirmación antes de eliminar", () => {
    render(<FeesManager clients={clients} fees={[fees[0]]} />);

    fireEvent.click(screen.getByRole("button", { name: "Editar cuota de Cliente 1, 2026-10" }));
    expect(screen.getByRole("dialog", { name: "Cliente 1 · 2026-10" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar edición de cuota" }));

    fireEvent.click(screen.getByRole("button", { name: "Eliminar cuota de Cliente 1, 2026-10" }));
    expect(screen.getByRole("alertdialog", { name: "Eliminar cuota" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar cuota" })).toBeInTheDocument();
  });
});
