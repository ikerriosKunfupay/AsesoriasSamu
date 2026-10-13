import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProfileAvatar } from "./profile-avatar";

afterEach(cleanup);

describe("ProfileAvatar", () => {
  it("muestra iniciales cuando todavía no existe una foto", () => {
    render(<ProfileAvatar name="Iker Ríos Navarro" />);

    expect(screen.getByRole("img", { name: "Iniciales de Iker Ríos Navarro" })).toHaveTextContent("IR");
  });

  it("amplía la foto y permite cerrar el visor", async () => {
    render(<ProfileAvatar name="Iker Ríos" src="https://example.com/avatar?token=secure" />);

    const avatar = screen.getByRole("button", { name: "Ampliar foto de perfil de Iker Ríos" });
    expect(avatar).toHaveStyle({ backgroundImage: "url(https://example.com/avatar?token=secure)" });
    expect(avatar).toBeEmptyDOMElement();

    fireEvent.click(avatar);
    expect(screen.getByRole("dialog", { name: "Foto de perfil de Iker Ríos" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Foto ampliada de Iker Ríos" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar foto ampliada" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(avatar).toHaveFocus());
  });

  it("cierra la foto ampliada mediante Escape", () => {
    render(<ProfileAvatar name="Iker Ríos" src="https://example.com/avatar" />);

    fireEvent.click(screen.getByRole("button", { name: "Ampliar foto de perfil de Iker Ríos" }));
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
