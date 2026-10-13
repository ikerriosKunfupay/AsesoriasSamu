import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InternalSelect } from "./internal-select";

const options = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
] as const;

afterEach(cleanup);

describe("InternalSelect", () => {
  it("abre el listbox propio y envía el valor seleccionado", () => {
    const { container } = render(
      <InternalSelect id="sex" name="sex" options={options} placeholder="Selecciona" ariaLabel="Sexo" />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Sexo" }));
    fireEvent.click(screen.getByRole("option", { name: "Mujer" }));

    expect(screen.getByRole("combobox", { name: "Sexo" })).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector('input[name="sex"]')).toHaveValue("mujer");
  });

  it("permite recorrer las opciones con teclado", async () => {
    render(<InternalSelect id="sex" name="sex" options={options} ariaLabel="Sexo" />);

    const trigger = screen.getByRole("combobox", { name: "Sexo" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("option")[0]).toHaveFocus());
  });
});
