import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { parseSocialProfiles } from "@/lib/forms/social-networks";
import { SocialNetworksField } from "./social-networks-field";

afterEach(cleanup);

describe("SocialNetworksField", () => {
  it("permanece compacto y crea perfiles con URL predefinida", () => {
    const { container } = render(<SocialNetworksField />);
    const summary = screen.getByText("Añade solo las que quieras compartir").closest("summary");

    expect(screen.getByRole("combobox", { name: "Red social 1" })).not.toBeVisible();
    fireEvent.click(summary!);

    const platform = screen.getByRole("combobox", { name: "Red social 1" });
    expect(platform).toHaveTextContent("Instagram");
    expect(screen.getByText("https://www.instagram.com/")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Usuario de Instagram" }), {
      target: { value: "@team.ortega" },
    });

    const hiddenValue = container.querySelector<HTMLInputElement>('input[name="socialNetworks"]')?.value;
    expect(parseSocialProfiles(hiddenValue)).toEqual([
      { platform: "instagram", username: "team.ortega" },
    ]);
  });

  it("permite añadir, cambiar y eliminar redes", () => {
    render(<SocialNetworksField initialValue='[{"platform":"instagram","username":"teamortega"}]' />);

    fireEvent.click(screen.getByText("1 perfil añadido"));
    fireEvent.click(screen.getByRole("button", { name: "Añadir otra red" }));

    const secondSelect = screen.getByRole("combobox", { name: "Red social 2" });
    fireEvent.click(secondSelect);
    fireEvent.click(screen.getByRole("option", { name: "Snapchat" }));

    expect(screen.getByText("https://www.snapchat.com/add/")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Snapchat" }));
    expect(screen.queryByRole("combobox", { name: "Red social 2" })).not.toBeInTheDocument();
  });
});
