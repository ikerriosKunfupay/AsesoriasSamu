import { describe, expect, it } from "vitest";
import {
  parseUnsignedDecimal,
  sanitizeUnsignedDecimalInput,
  sanitizeUnsignedIntegerInput,
} from "./numeric-values";

describe("campos numéricos localizados", () => {
  it("elimina signos, letras y decimales de la edad", () => {
    expect(sanitizeUnsignedIntegerInput("-34e.5años")).toBe("345");
  });

  it("conserva únicamente un separador decimal en peso y altura", () => {
    expect(sanitizeUnsignedDecimalInput("60,--5kg")).toBe("60,5");
    expect(sanitizeUnsignedDecimalInput("178.2.4")).toBe("178.24");
  });

  it("convierte la coma decimal a un número canónico", () => {
    expect(parseUnsignedDecimal("80,25")).toBe(80.25);
    expect(parseUnsignedDecimal("80.25")).toBe(80.25);
  });
});
