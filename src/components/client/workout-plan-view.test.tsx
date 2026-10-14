import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WorkoutPlan } from "@/lib/workouts/plan";
import { WorkoutPlanView } from "./workout-plan-view";

vi.mock("@/app/actions/client", () => ({
  saveWorkoutSetLogsAction: vi.fn(),
}));

afterEach(cleanup);

const exerciseId = "11111111-1111-4111-8111-111111111111";
const plan: WorkoutPlan = {
  schemaVersion: 1,
  blockName: "Bloque de hipertrofia",
  objective: "Mejorar el volumen de entrenamiento.",
  phase: "Acumulación",
  weeks: [{
    id: "22222222-2222-4222-8222-222222222222",
    number: 1,
    name: "Semana de entrada",
    objective: "Mantener dos repeticiones en recámara.",
    phase: "Adaptación",
    stepsTarget: 8000,
    cardioNotes: "2 × 20 min Z2",
    sessions: [{
      id: "33333333-3333-4333-8333-333333333333",
      number: 1,
      name: "Torso A",
      exercises: [{
        id: exerciseId,
        muscleGroup: "Pectoral",
        name: "Press banca",
        method: "Tempo controlado",
        sets: 2,
        reps: "8-10",
        targetRir: [2, 2],
        rest: "2 min",
        cues: "Mantén los pies apoyados.",
      }],
    }],
  }],
};

describe("WorkoutPlanView", () => {
  it("muestra el resumen y permite abrir la semana con los registros existentes", () => {
    render(
      <WorkoutPlanView
        assignment={{
          id: "44444444-4444-4444-8444-444444444444",
          title: "Plan octubre",
          startsOn: "2026-10-14",
          updatedAt: "2026-10-14T08:00:00Z",
          plan,
        }}
        logs={[{
          exerciseId,
          weekNumber: 1,
          sessionNumber: 1,
          setNumber: 1,
          loadKg: 80,
          reps: 9,
          rir: 2,
        }]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Resumen del bloque" })).toBeInTheDocument();
    expect(screen.getByText("Series registradas").nextElementSibling).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("tab", { name: "Semana 1" }));

    expect(screen.getByRole("heading", { name: "Torso A" })).toBeInTheDocument();
    expect(screen.getByLabelText("Press banca, serie 1, carga en kilos")).toHaveValue(80);
    expect(screen.getByRole("button", { name: /guardar resultados/i })).toBeInTheDocument();
  });
});
