import { describe, expect, it } from "vitest";
import {
  leadSchema,
  onboardingSchema,
  profileSettingsSchema,
  registerSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "./schemas";

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

  it("valida un registro de cliente completo", () => {
    const result = registerSchema.safeParse({
      fullName: "María López",
      email: "maria@example.com",
      password: "una-clave-segura",
      confirmation: "una-clave-segura",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza un registro con contraseñas diferentes", () => {
    const result = registerSchema.safeParse({
      fullName: "María López",
      email: "maria@example.com",
      password: "una-clave-segura",
      confirmation: "otra-clave-segura",
    });
    expect(result.success).toBe(false);
  });

  it("acepta una contraseña de exactamente 8 caracteres", () => {
    const result = registerSchema.safeParse({
      fullName: "María López",
      email: "maria@example.com",
      password: "12345678",
      confirmation: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza ambas contraseñas cuando no llegan a 8 caracteres", () => {
    const result = registerSchema.safeParse({
      fullName: "María López",
      email: "maria@example.com",
      password: "1234567",
      confirmation: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
      expect(result.error.flatten().fieldErrors.confirmation).toBeDefined();
    }
  });

  it("aplica el mínimo de 8 caracteres al cambio de contraseña", () => {
    expect(updatePasswordSchema.safeParse({ password: "12345678", confirmation: "12345678" }).success).toBe(true);
    expect(updatePasswordSchema.safeParse({ password: "1234567", confirmation: "1234567" }).success).toBe(false);
  });

  it("valida los datos básicos editables del cliente", () => {
    const result = profileSettingsSchema.safeParse({
      fullName: "María Ortega",
      phone: "+34 600 000 000",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza un correo nuevo inválido", () => {
    const result = updateEmailSchema.safeParse({ newEmail: "correo-invalido" });
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

  it("normaliza coma y punto antes de guardar peso y altura", () => {
    const result = onboardingSchema.safeParse({
      age: "30",
      sex: "mujer",
      weightKg: "80,25",
      heightCm: "178.5",
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
    if (result.success) {
      expect(result.data.weightKg).toBe(80.25);
      expect(result.data.heightCm).toBe(178.5);
    }
  });

  it.each([
    ["1,69", 169],
    ["1.725", 172.5],
    ["169", 169],
  ])("acepta la altura %s y la guarda en centímetros", (heightCm, expected) => {
    const result = onboardingSchema.safeParse({
      age: "30",
      sex: "hombre",
      weightKg: "80",
      heightCm,
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
    if (result.success) expect(result.data.heightCm).toBe(expected);
  });

  it("acepta perfiles sociales estructurados y rechaza texto libre", () => {
    const base = {
      age: "30",
      sex: "mujer",
      weightKg: "60",
      heightCm: "165",
      occupationSchedule: "Trabajo de mañana de lunes a viernes.",
      trainingPriority: "Entrenar fuerza cuatro días por semana.",
      mealAvailability: "Cuatro comidas con pausa al mediodía.",
      conditionsInjuries: "",
      allergiesIntolerances: "",
      goals: "Mejorar fuerza y composición corporal.",
      healthConsent: "on",
    };

    expect(onboardingSchema.safeParse({
      ...base,
      socialNetworks: '[{"platform":"instagram","username":"team.ortega"}]',
    }).success).toBe(true);
    expect(onboardingSchema.safeParse({ ...base, socialNetworks: "Instagram: @team.ortega" }).success)
      .toBe(false);
  });

  it.each(["-34", "34.5", "34e2", "edad"])(
    "rechaza una edad que no sea un entero positivo: %s",
    (age) => {
      const result = onboardingSchema.safeParse({
        age,
        sex: "hombre",
        weightKg: "80",
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

      expect(result.success).toBe(false);
    },
  );

  it.each(["-80", "80kg", "80--", "80,2.5"])(
    "rechaza peso con signos, texto o más de un separador: %s",
    (weightKg) => {
      const result = onboardingSchema.safeParse({
        age: "30",
        sex: "hombre",
        weightKg,
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

      expect(result.success).toBe(false);
    },
  );
});
