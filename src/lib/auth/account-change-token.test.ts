import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createAccountChangeToken, verifyAccountChangeToken } from "./account-change-token";

describe("tokens de cambios sensibles", () => {
  beforeEach(() => {
    process.env.ACCOUNT_CHANGE_SECRET = "un-secreto-de-pruebas-suficientemente-largo";
  });

  it("acepta únicamente el usuario y el tipo de cambio firmados", () => {
    const now = Date.UTC(2026, 9, 13);
    const token = createAccountChangeToken("user-1", "email", now);

    expect(verifyAccountChangeToken(token, "email", "user-1", now)).toBe(true);
    expect(verifyAccountChangeToken(token, "password", "user-1", now)).toBe(false);
    expect(verifyAccountChangeToken(token, "email", "user-2", now)).toBe(false);
  });

  it("rechaza tokens manipulados o caducados", () => {
    const now = Date.UTC(2026, 9, 13);
    const token = createAccountChangeToken("user-1", "password", now);
    const manipulated = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;

    expect(verifyAccountChangeToken(manipulated, "password", "user-1", now)).toBe(false);
    expect(verifyAccountChangeToken(token, "password", "user-1", now + 11 * 60 * 1000)).toBe(false);
  });
});
