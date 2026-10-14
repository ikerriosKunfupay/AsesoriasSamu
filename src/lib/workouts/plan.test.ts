import { describe, expect, it } from "vitest";
import {
  cloneWorkoutWeek,
  createBlankWorkoutPlan,
  parseWorkoutPlan,
  workoutPlanStats,
} from "./plan";

describe("workoutPlanSchema", () => {
  it("crea un plan mínimo válido y calcula su resumen", () => {
    const plan = createBlankWorkoutPlan();
    plan.weeks[0].sessions[0].exercises[0].muscleGroup = "Pectoral";
    plan.weeks[0].sessions[0].exercises[0].name = "Press banca";

    expect(parseWorkoutPlan(plan)).not.toBeNull();
    expect(workoutPlanStats(plan)).toMatchObject({
      weeks: 1,
      sessions: 1,
      exercises: 1,
      series: 3,
      averageTargetRir: 2,
      seriesByMuscle: [{ muscleGroup: "Pectoral", series: 3, percentage: 100 }],
    });
  });

  it("rechaza una planificación cuyo RIR no coincide con las series", () => {
    const plan = createBlankWorkoutPlan();
    plan.weeks[0].sessions[0].exercises[0].muscleGroup = "Espalda";
    plan.weeks[0].sessions[0].exercises[0].name = "Remo";
    plan.weeks[0].sessions[0].exercises[0].targetRir = [2];

    expect(parseWorkoutPlan(plan)).toBeNull();
  });

  it("duplica semanas sin reutilizar identificadores de ejercicios", () => {
    const plan = createBlankWorkoutPlan();
    const duplicated = cloneWorkoutWeek(plan.weeks[0], 2);

    expect(duplicated.number).toBe(2);
    expect(duplicated.id).not.toBe(plan.weeks[0].id);
    expect(duplicated.sessions[0].id).not.toBe(plan.weeks[0].sessions[0].id);
    expect(duplicated.sessions[0].exercises[0].id).not.toBe(plan.weeks[0].sessions[0].exercises[0].id);
  });
});
