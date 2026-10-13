import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DismissibleNotice } from "./dismissible-notice";

afterEach(cleanup);

describe("DismissibleNotice", () => {
  it("permite ocultar el aviso con un botón etiquetado", () => {
    render(<DismissibleNotice>Aviso de privacidad</DismissibleNotice>);

    expect(screen.getByText("Aviso de privacidad")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar aviso de privacidad" }));
    expect(screen.queryByText("Aviso de privacidad")).not.toBeInTheDocument();
  });
});
