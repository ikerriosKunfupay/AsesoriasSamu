import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FormErrorToast } from "./form-error-toast";

afterEach(cleanup);

describe("FormErrorToast", () => {
  it("muestra el error, permite cerrarlo y reaparece ante un error nuevo", () => {
    const { rerender } = render(
      <FormErrorToast message="Debes aceptar el consentimiento." messageId="error-1" />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Debes aceptar el consentimiento.");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(<FormErrorToast message="Debes aceptar el consentimiento." messageId="error-2" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
