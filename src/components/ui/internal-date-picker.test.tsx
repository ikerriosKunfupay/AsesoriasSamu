import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InternalDatePicker } from "./internal-date-picker";

afterEach(cleanup);

describe("InternalDatePicker", () => {
  it("usa un calendario propio y entrega la fecha ISO al formulario", () => {
    const { container } = render(
      <InternalDatePicker id="starts-on" name="startsOn" ariaLabel="Fecha de inicio" defaultValue="2026-10-15" />,
    );

    expect(screen.getByRole("button", { name: "Fecha de inicio" })).toHaveTextContent("15/10/2026");
    expect(container.querySelector('input[type="date"]')).not.toBeInTheDocument();
    expect(container.querySelector('input[name="startsOn"]')).toHaveValue("2026-10-15");

    fireEvent.click(screen.getByRole("button", { name: "Fecha de inicio" }));
    expect(screen.getByRole("dialog", { name: "Calendario para Fecha de inicio" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /16 de octubre de 2026/i }));

    expect(screen.getByRole("button", { name: "Fecha de inicio" })).toHaveTextContent("16/10/2026");
    expect(container.querySelector('input[name="startsOn"]')).toHaveValue("2026-10-16");
  });

  it("permite borrar la fecha sin abrir el selector del sistema", () => {
    const { container } = render(
      <InternalDatePicker id="filter-date" name="filterDate" ariaLabel="Filtrar fecha" defaultValue="2026-10-15" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Filtrar fecha" }));
    fireEvent.click(screen.getByRole("button", { name: "Borrar" }));

    expect(screen.getByRole("button", { name: "Filtrar fecha" })).toHaveTextContent("dd/mm/aaaa");
    expect(container.querySelector('input[name="filterDate"]')).toHaveValue("");
  });
});
