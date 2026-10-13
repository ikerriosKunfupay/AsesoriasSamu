import { z } from "zod";
import { isValidSocialProfilesValue } from "./social-networks";
import { parseUnsignedDecimal, parseUnsignedInteger } from "./numeric-values";

const requiredText = (label: string, min = 2) =>
  z.string().trim().min(min, `${label} es obligatorio.`).max(2000, `${label} es demasiado largo.`);

export const loginSchema = z.object({
  email: z.string().trim().email("Introduce un correo válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const registerSchema = z
  .object({
    fullName: requiredText("El nombre").max(120),
    email: z.string().trim().email("Introduce un correo válido."),
    password: z.string().min(10, "Usa al menos 10 caracteres."),
    confirmation: z.string().min(10, "Usa al menos 10 caracteres."),
  })
  .refine((value) => value.password === value.confirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmation"],
  });

export const emailSchema = z.object({
  email: z.string().trim().email("Introduce un correo válido."),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(10, "Usa al menos 10 caracteres."),
    confirmation: z.string(),
  })
  .refine((value) => value.password === value.confirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmation"],
  });

export const leadSchema = z.object({
  fullName: requiredText("El nombre").max(120),
  email: z.string().trim().email("Introduce un correo válido."),
  phone: z.string().trim().min(7, "Introduce un teléfono válido.").max(30),
  goal: requiredText("El objetivo", 10),
  contactPreference: z.enum(["whatsapp", "phone", "email"]),
  website: z.string().max(0, "Solicitud no válida."),
  startedAt: z.coerce.number().int().positive(),
});

export const inviteSchema = z.object({
  fullName: requiredText("El nombre").max(120),
  email: z.string().trim().email("Introduce un correo válido."),
});

export const onboardingSchema = z.object({
  age: z.preprocess(
    parseUnsignedInteger,
    z.number({ error: "Introduce una edad válida." }).int().min(16, "La edad mínima es 16 años.").max(90),
  ),
  sex: z.enum(["mujer", "hombre", "otro", "prefiero_no_indicar"]),
  weightKg: z.preprocess(
    parseUnsignedDecimal,
    z.number({ error: "Introduce un peso válido." }).min(35).max(300),
  ),
  heightCm: z.preprocess(
    parseUnsignedDecimal,
    z.number({ error: "Introduce una altura válida." }).min(120).max(230),
  ),
  occupationSchedule: requiredText("El horario", 5),
  trainingPriority: requiredText("La prioridad", 5),
  mealAvailability: requiredText("La disponibilidad para comer", 5),
  conditionsInjuries: z.string().trim().max(2000).optional(),
  allergiesIntolerances: z.string().trim().max(2000).optional(),
  goals: requiredText("Los objetivos", 10),
  socialNetworks: z
    .string()
    .trim()
    .max(2000)
    .refine(isValidSocialProfilesValue, "Revisa los perfiles sociales indicados.")
    .optional(),
  healthConsent: z.literal("on", { message: "Debes aceptar el tratamiento de datos de salud." }),
});

export const assignmentSchema = z.object({
  clientId: z.string().uuid("Cliente no válido."),
  kind: z.enum(["workout", "nutrition"]),
  title: requiredText("El título").max(160),
  content: requiredText("El contenido", 20),
  startsOn: z.string().date().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export const checkInSchema = z.object({
  weightKg: z.union([z.coerce.number().min(35).max(300), z.literal("")]).optional(),
  energyLevel: z.coerce.number().int().min(1).max(5),
  adherenceLevel: z.coerce.number().int().min(1).max(5),
  notes: z.string().trim().max(2000).optional(),
});

export const feeSchema = z.object({
  clientId: z.string().uuid("Cliente no válido."),
  period: z.string().regex(/^\d{4}-\d{2}$/, "El periodo no es válido."),
  amountEur: z.coerce.number().min(0).max(10000),
  status: z.enum(["pending", "paid", "waived"]),
  notes: z.string().trim().max(500).optional(),
});

export function formValues(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function fieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
