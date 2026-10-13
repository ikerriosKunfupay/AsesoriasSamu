import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProfileAvatar } from "./profile-avatar";

afterEach(cleanup);

describe("ProfileAvatar", () => {
  it("muestra iniciales cuando todavía no existe una foto", () => {
    render(<ProfileAvatar name="Iker Ríos Navarro" />);

    expect(screen.getByRole("img", { name: "Iniciales de Iker Ríos Navarro" })).toHaveTextContent("IR");
  });

  it("usa la URL firmada sin mostrar las iniciales", () => {
    render(<ProfileAvatar name="Iker Ríos" src="https://example.com/avatar?token=secure" />);

    const avatar = screen.getByRole("img", { name: "Foto de perfil de Iker Ríos" });
    expect(avatar).toHaveStyle({ backgroundImage: "url(https://example.com/avatar?token=secure)" });
    expect(avatar).toBeEmptyDOMElement();
  });
});
