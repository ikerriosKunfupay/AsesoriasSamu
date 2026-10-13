import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  REGISTRATION_REDIRECT_DELAY_MS,
  RegistrationSuccessDialog,
} from "./registration-success-dialog";

describe("RegistrationSuccessDialog", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra la confirmación y permite ir al login inmediatamente", () => {
    const onContinue = vi.fn();
    render(
      <RegistrationSuccessDialog
        message="Cuenta creada. Revisa tu correo para confirmarla."
        onContinue={onContinue}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Cuenta creada" })).toBeInTheDocument();
    screen.getByRole("button", { name: "Ir al login" }).click();
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("redirige automáticamente después de mostrar el mensaje", () => {
    vi.useFakeTimers();
    const onContinue = vi.fn();
    render(
      <RegistrationSuccessDialog
        message="Cuenta creada. Revisa tu correo para confirmarla."
        onContinue={onContinue}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(REGISTRATION_REDIRECT_DELAY_MS);
    });

    expect(onContinue).toHaveBeenCalledOnce();
  });
});
