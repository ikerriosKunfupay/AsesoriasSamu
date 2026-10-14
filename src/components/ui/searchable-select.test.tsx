import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchableSelect } from "./searchable-select";

afterEach(cleanup);

describe("SearchableSelect", () => {
  it("filtra sin tildes y devuelve la opción elegida", () => {
    const onValueChange = vi.fn();
    render(
      <SearchableSelect
        id="muscle"
        ariaLabel="Grupo muscular"
        value=""
        options={[
          { value: "quads", label: "CUÁDRICEPS" },
          { value: "chest", label: "PECTORAL" },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Grupo muscular" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "cuadriceps" } });

    expect(screen.getByRole("option", { name: "CUÁDRICEPS" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "PECTORAL" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "CUÁDRICEPS" }));
    expect(onValueChange).toHaveBeenCalledWith("quads");
  });

  it("permite elegir con teclado", () => {
    const onValueChange = vi.fn();
    render(
      <SearchableSelect
        id="exercise"
        ariaLabel="Ejercicio"
        value=""
        options={[{ value: "hack", label: "Sentadilla Hack" }]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Ejercicio" });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("hack");
  });
});
