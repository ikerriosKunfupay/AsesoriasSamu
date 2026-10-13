import { describe, expect, it } from "vitest";
import { getClientDetailHref, getClientReturnDestination } from "./client-navigation";

describe("navegación de la ficha de cliente", () => {
  it("construye un enlace que conserva el resumen como origen", () => {
    expect(getClientDetailHref("cliente-1", "/admin")).toBe(
      "/admin/clientes/cliente-1?returnTo=%2Fadmin",
    );
  });

  it("conserva el origen al enlazar directamente el cuestionario", () => {
    expect(getClientDetailHref("cliente-1", "/admin", "cuestionario")).toBe(
      "/admin/clientes/cliente-1?returnTo=%2Fadmin#cuestionario",
    );
  });

  it("solo acepta destinos internos conocidos", () => {
    expect(getClientReturnDestination("/admin/seguimientos")).toEqual({
      href: "/admin/seguimientos",
      label: "Volver a seguimientos",
    });
    expect(getClientReturnDestination("https://example.com")).toEqual({
      href: "/admin/clientes",
      label: "Volver a clientes",
    });
  });
});
