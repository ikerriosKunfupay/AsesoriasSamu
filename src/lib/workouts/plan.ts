import { z } from "zod";

const compactText = (label: string, maximum: number) =>
  z.string().trim().min(1, `${label} es obligatorio.`).max(maximum, `${label} es demasiado largo.`);

const optionalText = (maximum: number) => z.string().trim().max(maximum).default("");

export const workoutExerciseSchema = z.object({
  id: z.string().uuid("Ejercicio no válido."),
  catalogExerciseId: z.string().uuid("Ejercicio de catálogo no válido.").nullable().default(null),
  muscleGroup: compactText("El grupo muscular", 80),
  name: compactText("El ejercicio", 160),
  referenceUrl: z.union([
    z.literal(""),
    z.string().trim().url("El enlace del ejercicio no es válido.").max(500, "El enlace del ejercicio es demasiado largo."),
  ]).default(""),
  method: optionalText(300),
  sets: z.number().int().min(1).max(5),
  reps: compactText("Las repeticiones", 40),
  targetRir: z.array(z.number().min(0).max(10).nullable()).min(1).max(5),
  rest: optionalText(80),
  cues: optionalText(4000),
}).superRefine((exercise, context) => {
  if (exercise.targetRir.length !== exercise.sets) {
    context.addIssue({
      code: "custom",
      path: ["targetRir"],
      message: "Indica un RIR objetivo por serie.",
    });
  }
});

export const workoutSessionSchema = z.object({
  id: z.string().uuid("Sesión no válida."),
  number: z.number().int().min(1).max(8),
  name: compactText("El nombre de la sesión", 100),
  exercises: z.array(workoutExerciseSchema).min(1).max(20),
});

export const workoutWeekSchema = z.object({
  id: z.string().uuid("Semana no válida."),
  number: z.number().int().min(1).max(16),
  name: optionalText(100),
  objective: optionalText(500),
  phase: optionalText(120),
  stepsTarget: z.number().int().min(0).max(100000).nullable(),
  cardioNotes: optionalText(500),
  sessions: z.array(workoutSessionSchema).min(1).max(8),
});

export const workoutPlanSchema = z.object({
  schemaVersion: z.literal(1),
  blockName: compactText("El nombre del bloque", 120),
  objective: optionalText(500),
  phase: optionalText(120),
  weeks: z.array(workoutWeekSchema).min(1).max(16),
}).superRefine((plan, context) => {
  const ids = new Set<string>();
  for (const [weekIndex, week] of plan.weeks.entries()) {
    if (week.number !== weekIndex + 1) {
      context.addIssue({ code: "custom", path: ["weeks", weekIndex, "number"], message: "Las semanas deben estar ordenadas." });
    }
    for (const [sessionIndex, session] of week.sessions.entries()) {
      if (session.number !== sessionIndex + 1) {
        context.addIssue({ code: "custom", path: ["weeks", weekIndex, "sessions", sessionIndex, "number"], message: "Las sesiones deben estar ordenadas." });
      }
      for (const [exerciseIndex, exercise] of session.exercises.entries()) {
        if (ids.has(exercise.id)) {
          context.addIssue({ code: "custom", path: ["weeks", weekIndex, "sessions", sessionIndex, "exercises", exerciseIndex, "id"], message: "Cada ejercicio necesita un identificador único." });
        }
        ids.add(exercise.id);
      }
    }
  }
});

export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
export type WorkoutWeek = z.infer<typeof workoutWeekSchema>;
export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;

export type WorkoutSetLog = {
  exerciseId: string;
  weekNumber: number;
  sessionNumber: number;
  setNumber: number;
  loadKg: number | null;
  reps: number | null;
  rir: number | null;
};

function createBlankExercise(): WorkoutExercise {
  return {
    id: crypto.randomUUID(),
    catalogExerciseId: null,
    muscleGroup: "",
    name: "",
    referenceUrl: "",
    method: "",
    sets: 3,
    reps: "8-12",
    targetRir: [2, 2, 2],
    rest: "2 min",
    cues: "",
  };
}

function createBlankSession(number: number): WorkoutSession {
  return {
    id: crypto.randomUUID(),
    number,
    name: `Sesión ${number}`,
    exercises: [createBlankExercise()],
  };
}

export function createBlankWorkoutPlan(): WorkoutPlan {
  return {
    schemaVersion: 1,
    blockName: "Nuevo bloque",
    objective: "",
    phase: "",
    weeks: [{
      id: crypto.randomUUID(),
      number: 1,
      name: "Semana 1",
      objective: "",
      phase: "",
      stepsTarget: null,
      cardioNotes: "",
      sessions: [createBlankSession(1)],
    }],
  };
}

export function cloneWorkoutWeek(source: WorkoutWeek, number: number): WorkoutWeek {
  return {
    ...source,
    id: crypto.randomUUID(),
    number,
    name: `Semana ${number}`,
    sessions: source.sessions.map((session, sessionIndex) => ({
      ...session,
      id: crypto.randomUUID(),
      number: sessionIndex + 1,
      exercises: session.exercises.map((exercise) => ({ ...exercise, id: crypto.randomUUID() })),
    })),
  };
}

export function appendBlankSession(week: WorkoutWeek): WorkoutWeek {
  return { ...week, sessions: [...week.sessions, createBlankSession(week.sessions.length + 1)] };
}

export function appendBlankExercise(session: WorkoutSession): WorkoutSession {
  return { ...session, exercises: [...session.exercises, createBlankExercise()] };
}

export function parseWorkoutPlan(value: unknown): WorkoutPlan | null {
  let candidate = value;
  if (typeof value === "string") {
    try {
      candidate = JSON.parse(value);
    } catch {
      return null;
    }
  }
  const parsed = workoutPlanSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export function workoutPlanFallbackContent(plan: WorkoutPlan) {
  const sessionCount = plan.weeks.reduce((total, week) => total + week.sessions.length, 0);
  const exerciseCount = plan.weeks.reduce(
    (total, week) => total + week.sessions.reduce((weekTotal, session) => weekTotal + session.exercises.length, 0),
    0,
  );
  return `${plan.blockName}\n${plan.weeks.length} semanas · ${sessionCount} sesiones · ${exerciseCount} ejercicios`;
}

export function workoutPlanStats(plan: WorkoutPlan) {
  const seriesByMuscle = new Map<string, number>();
  let sessions = 0;
  let exercises = 0;
  let series = 0;
  let targetRirTotal = 0;
  let targetRirCount = 0;

  for (const week of plan.weeks) {
    sessions += week.sessions.length;
    for (const session of week.sessions) {
      exercises += session.exercises.length;
      for (const exercise of session.exercises) {
        series += exercise.sets;
        seriesByMuscle.set(exercise.muscleGroup, (seriesByMuscle.get(exercise.muscleGroup) ?? 0) + exercise.sets);
        for (const rir of exercise.targetRir) {
          if (rir !== null) {
            targetRirTotal += rir;
            targetRirCount += 1;
          }
        }
      }
    }
  }

  return {
    weeks: plan.weeks.length,
    sessions,
    exercises,
    series,
    averageTargetRir: targetRirCount ? targetRirTotal / targetRirCount : null,
    seriesByMuscle: [...seriesByMuscle.entries()]
      .map(([muscleGroup, muscleSeries]) => ({
        muscleGroup,
        series: muscleSeries,
        percentage: series ? (muscleSeries / series) * 100 : 0,
      }))
      .sort((left, right) => right.series - left.series || left.muscleGroup.localeCompare(right.muscleGroup)),
  };
}

export function findWorkoutExercise(plan: WorkoutPlan, exerciseId: string) {
  for (const week of plan.weeks) {
    for (const session of week.sessions) {
      const exercise = session.exercises.find((candidate) => candidate.id === exerciseId);
      if (exercise) return { week, session, exercise };
    }
  }
  return null;
}
