import { describe, expect, it } from "vitest";
import { leadSchema, onboardingSchema, updatePasswordSchema } from "./schemas";

describe("validación de formularios", () => {
  it("acepta una solicitud pública válida", () => {
    const result = leadSchema.safeParse({
      fullName: "María López",
      email: "maria@example.com",
      phone: "+34 600 000 000",
      goal: "Ganar fuerza y crear una rutina sostenible.",
      contactPreference: "whatsapp",
      website: "",
      startedAt: Date.now() - 3000,
    });
    expect(result.success).toBe(true);
  });

  it("bloquea el campo señuelo del formulario público", () => {
    const result = leadSchema.safeParse({
      fullName: "Bot Example",
      email: "bot@example.com",
      phone: "600000000",
      goal: "Este contenido parece una solicitud válida.",
      contactPreference: "email",
      website: "https://spam.example",
      startedAt: Date.now() - 3000,
    });
    expect(result.success).toBe(false);
  });

  it("exige contraseñas coincidentes", () => {
    const result = updatePasswordSchema.safeParse({ password: "una-clave-segura", confirmation: "otra-clave-segura" });
    expect(result.success).toBe(false);
  });

  it("valida los límites físicos del cuestionario", () => {
    const result = onboardingSchema.safeParse({
      age: "30",
      sex: "hombre",
      weightKg: "80.2",
      heightCm: "178",
      occupationSchedule: "Trabajo de mañana de lunes a viernes.",
      trainingPriority: "Entrenar fuerza cuatro días por semana.",
      mealAvailability: "Cuatro comidas con pausa al mediodía.",
      conditionsInjuries: "",
      allergiesIntolerances: "",
      goals: "Mejorar fuerza y composición corporal.",
      socialNetworks: "",
      healthConsent: "on",
    });
    expect(result.success).toBe(true);
  });
});
