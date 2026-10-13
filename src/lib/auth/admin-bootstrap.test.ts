import { describe, expect, it } from "vitest";
import { needsInitialAdminPromotion } from "./admin-bootstrap";

describe("bootstrap del administrador inicial", () => {
  it("solo promociona la cuenta designada mientras todavía es cliente", () => {
    expect(needsInitialAdminPromotion("samprox77@gmail.com", "client")).toBe(true);
    expect(needsInitialAdminPromotion("cliente@example.com", "client")).toBe(false);
  });

  it("no vuelve a escribir el perfil cuando ya es administrador", () => {
    expect(needsInitialAdminPromotion("samprox77@gmail.com", "admin")).toBe(false);
  });
});
