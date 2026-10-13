import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FieldHelp } from "./field-help";

afterEach(cleanup);

const content = {
  description: "Explica tu rutina habitual.",
  examples: ["Horarios de trabajo.", "Tiempo disponible."],
};

describe("FieldHelp", () => {
  it("abre una explicación específica y permite cerrarla", async () => {
    render(<FieldHelp label="Rutina semanal" content={content} />);

    const trigger = screen.getByRole("button", { name: "Más información sobre Rutina semanal" });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Rutina semanal" })).toBeInTheDocument();
    expect(screen.getByText(/cuanto más concreta y desarrollada/i)).toBeInTheDocument();
    expect(screen.getByText("Horarios de trabajo.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar ayuda" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("cierra la ayuda con Escape y devuelve el foco", async () => {
    render(<FieldHelp label="Rutina semanal" content={content} />);

    const trigger = screen.getByRole("button", { name: "Más información sobre Rutina semanal" });
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
