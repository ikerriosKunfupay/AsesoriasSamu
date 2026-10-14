import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/profile", () => ({
  updateAdminProfileAction: vi.fn(),
  updateProfileAction: vi.fn(),
}));

vi.mock("@/app/actions/account-security", () => ({
  requestAccountChangeAction: vi.fn(),
}));

import { ProfileSettingsForm } from "./profile-settings-form";

afterEach(cleanup);

describe("ProfileSettingsForm", () => {
  it("permite al administrador editar sus datos y su foto sin repetir el distintivo verificado", () => {
    render(
      <ProfileSettingsForm
        variant="admin"
        initial={{ fullName: "Samuel Ortega", phone: "+34600000000", email: "samuel@example.com" }}
        avatarUrl="https://example.com/samuel.jpg"
      />,
    );

    expect(screen.queryByText("Cuenta verificada")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Nombre y apellidos/ })).toHaveValue("Samuel Ortega");
    expect(screen.getByLabelText("Foto de perfil")).toHaveAttribute("accept", "image/jpeg,image/png,image/webp");
    expect(screen.getByRole("button", { name: "Quitar foto" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Seguridad de la cuenta" })).not.toBeInTheDocument();
  });
});
