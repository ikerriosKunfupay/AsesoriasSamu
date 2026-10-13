import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormMessage } from "./form-message";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("FormMessage", () => {
  it("oculta los avisos de éxito después de cinco segundos", () => {
    vi.useFakeTimers();
    render(<FormMessage state={{ status: "success", message: "Perfil actualizado." }} />);

    expect(screen.getByRole("status")).toHaveTextContent("Perfil actualizado.");
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("permite cerrar cualquier aviso manualmente", () => {
    render(<FormMessage state={{ status: "error", message: "No se pudo guardar." }} />);

    fireEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
