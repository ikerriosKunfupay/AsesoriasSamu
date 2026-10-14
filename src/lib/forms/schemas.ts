import { z } from "zod";
import { isValidSocialProfilesValue } from "./social-networks";
import {
  parseHeightCentimeters,
  parseUnsignedDecimal,
  parseUnsignedInteger,
} from "./numeric-values";
import { PASSWORD_MIN_LENGTH } from "./password-policy";

const requiredText = (label: string, min = 2) =>
  z.string().trim().min(min, `${label} es obligatorio.`).max(2000, `${label} es demasiado largo.`);

export const loginSchema = z.object({
  email: z.string().trim().email("Introduce un correo válido."),
  password: z.string().min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
});

export const registerSchema = z
  .object({
    fullName: requiredText("El nombre").max(120),
    email: z.string().trim().email("Introduce un correo válido."),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Usa al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
    confirmation: z.string().min(PASSWORD_MIN_LENGTH, `Usa al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
  })
  .refine((value) => value.password === value.confirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmation"],
  });

export const emailSchema = z.object({
  email: z.string().trim().email("Introduce un correo válido."),
});

export const profileSettingsSchema = z.object({
  fullName: requiredText("El nombre").max(120),
  phone: z.string().trim().max(30, "El teléfono es demasiado largo."),
});

export const updateEmailSchema = z.object({
  newEmail: z.string().trim().email("Introduce un correo válido."),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(PASSWORD_MIN_LENGTH, `Usa al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
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

export const clientAdminNoteSchema = z.object({
  clientId: z.string().uuid("Cliente no válido."),
  notes: z.string().trim().max(5000, "La nota no puede superar los 5000 caracteres."),
});

export const clientStatusSchema = z.object({
  clientId: z.string().uuid("Cliente no válido."),
  nextStatus: z.enum(["active", "archived"]),
});

export const clientCommercialQuickUpdateSchema = z.discriminatedUnion("field", [
  z.object({
    clientId: z.string().uuid("Cliente no válido."),
    field: z.literal("modality"),
    value: z.enum(["in_person", "online"]),
  }),
  z.object({
    clientId: z.string().uuid("Cliente no válido."),
    field: z.literal("pricingPlanId"),
    value: z.union([z.string().uuid("Tarifa no válida."), z.literal("")]),
  }),
]);

export const dashboardGoalsSchema = z.object({
  monthlyRevenueGoalEur: z.preprocess(
    parseUnsignedDecimal,
    z.number({ error: "Introduce un objetivo de ingresos válido." }).min(0).max(1000000),
  ),
  activeClientsGoal: z.preprocess(
    parseUnsignedInteger,
    z.number({ error: "Introduce un objetivo de clientes válido." }).int().min(0).max(100000),
  ),
});

const euroAmount = z.preprocess(
  parseUnsignedDecimal,
  z.number({ error: "Introduce un importe válido." }).min(0).max(100000),
);

const optionalDaysPerWeek = z.preprocess(
  (value) => value === "" || value === undefined ? null : value,
  z.coerce.number({ error: "Indica un número de días válido." }).int().min(1).max(7).nullable(),
);

export const pricingPlanSchema = z.object({
  pricingPlanId: z.union([z.string().uuid("Tarifa no válida."), z.literal("")]).optional(),
  name: requiredText("El nombre").max(80),
  serviceModality: z.enum(["in_person", "online"], { error: "Selecciona la modalidad." }),
  daysPerWeek: optionalDaysPerWeek,
  billingCycle: z.enum(["monthly", "semiannual", "annual", "custom"]),
  durationMonths: z.coerce.number().int().min(1).max(120).optional(),
  amountEur: euroAmount,
}).superRefine((value, context) => {
  if (value.billingCycle === "custom" && !value.durationMonths) {
    context.addIssue({ code: "custom", path: ["durationMonths"], message: "Indica cuántos meses cubre." });
  }
});

export const archivePricingPlanSchema = z.object({
  pricingPlanId: z.string().uuid("Tarifa no válida."),
});

export const clientCommercialTermsSchema = z
  .object({
    clientId: z.string().uuid("Cliente no válido."),
    modality: z.enum(["in_person", "online"]),
    pricingPlanId: z.union([z.string().uuid("Tarifa no válida."), z.literal("new")]),
    amountEur: euroAmount,
    newPlanName: z.string().trim().max(80).optional(),
    newBillingCycle: z.enum(["monthly", "semiannual", "annual", "custom"]).optional(),
    newDurationMonths: z.coerce.number().int().min(1).max(120).optional(),
    newPlanDaysPerWeek: optionalDaysPerWeek,
  })
  .superRefine((value, context) => {
    if (value.pricingPlanId !== "new") return;
    if (!value.newPlanName || value.newPlanName.length < 2) {
      context.addIssue({
        code: "custom",
        path: ["newPlanName"],
        message: "Indica el nombre de la nueva tarifa.",
      });
    }
    if (!value.newBillingCycle) {
      context.addIssue({
        code: "custom",
        path: ["newBillingCycle"],
        message: "Selecciona la periodicidad.",
      });
    }
    if (value.newBillingCycle === "custom" && !value.newDurationMonths) {
      context.addIssue({
        code: "custom",
        path: ["newDurationMonths"],
        message: "Indica cuántos meses cubre.",
      });
    }
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
    parseHeightCentimeters,
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
  saveAsTemplate: z.literal("on").optional(),
});

export const assignmentUpdateSchema = assignmentSchema.extend({
  assignmentId: z.string().uuid("Plan no válido."),
});

export const assignmentDeleteSchema = z.object({
  assignmentId: z.string().uuid("Plan no válido."),
  kind: z.enum(["workout", "nutrition"]),
});

export const assignmentTemplateUpdateSchema = z.object({
  templateId: z.string().uuid("Plantilla no válida."),
  kind: z.enum(["workout", "nutrition"]),
  name: requiredText("El nombre de la plantilla").max(160),
  title: requiredText("El título").max(160),
  content: requiredText("El contenido", 20),
});

export const assignmentTemplateDeleteSchema = z.object({
  templateId: z.string().uuid("Plantilla no válida."),
  kind: z.enum(["workout", "nutrition"]),
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

export const feeUpdateSchema = feeSchema.extend({
  feeId: z.string().uuid("Cuota no válida."),
});

export const feeDeleteSchema = z.object({
  feeId: z.string().uuid("Cuota no válida."),
});

export const feeNoteSchema = z.object({
  feeId: z.string().uuid("Cuota no válida."),
  notes: z.string().trim().max(500, "La nota no puede superar los 500 caracteres."),
});

export function formValues(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function fieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
