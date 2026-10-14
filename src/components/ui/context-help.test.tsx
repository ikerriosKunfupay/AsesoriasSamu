import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContextHelp } from "./context-help";

afterEach(cleanup);

describe("ContextHelp", () => {
  it("explica un concepto al pasar por encima, enfocar o pulsar", () => {
    render(<ContextHelp label="Ingresos cobrados" description="Suma las cuotas pagadas del periodo." />);

    const trigger = screen.getByRole("button", { name: "Más información sobre Ingresos cobrados" });
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Suma las cuotas pagadas del periodo.");

    fireEvent.mouseLeave(trigger.parentElement!);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.blur(trigger);

    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
