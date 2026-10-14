import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdminAssignment } from "@/lib/admin/assignments";
import type { WorkoutPlan } from "@/lib/workouts/plan";
import { AssignmentsManager } from "./assignments-manager";

vi.mock("@/app/actions/admin", () => ({
  deleteAssignmentAction: vi.fn(),
  deleteAssignmentTemplateAction: vi.fn(),
  saveAssignmentAction: vi.fn(),
  saveWorkoutPlanAction: vi.fn(),
  updateAssignmentAction: vi.fn(),
  updateAssignmentTemplateAction: vi.fn(),
  updateWorkoutPlanAction: vi.fn(),
}));

afterEach(cleanup);

const clients = Array.from({ length: 11 }, (_, index) => ({
  id: `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`,
  full_name: `Cliente ${index + 1}`,
}));

const assignments: AdminAssignment[] = clients.map((client, index) => ({
  id: `22222222-2222-4222-8222-${String(index).padStart(12, "0")}`,
  clientId: client.id,
  clientName: client.full_name,
  title: `Plan ${index + 1}`,
  content: `Contenido completo del plan ${index + 1} con suficiente detalle.`,
  status: index % 2 ? "draft" : "published",
  startsOn: null,
  createdAt: "2026-10-14T10:00:00.000Z",
}));

const templates = [{ id: "33333333-3333-4333-8333-333333333333", name: "Base fuerza", title: "Fuerza base", content: "Contenido reutilizable de fuerza con suficiente detalle." }];
const exerciseCatalog = [{
  id: "77777777-7777-4777-8777-777777777777",
  muscleGroup: "CUÁDRICEPS",
  name: "Sentadilla Hack",
  referenceUrl: "https://example.com/sentadilla-hack",
  cues: "Empuja la plataforma y controla la bajada.",
  muscleOrder: 1,
  sourceOrder: 1,
}];

const structuredPlan: WorkoutPlan = {
  schemaVersion: 1,
  blockName: "Bloque de demostración",
  objective: "Progresar con una estructura clara.",
  phase: "Acumulación",
  weeks: [{
    id: "44444444-4444-4444-8444-444444444444",
    number: 1,
    name: "Semana 1",
    objective: "Dominar la técnica.",
    phase: "Base",
    stepsTarget: 8000,
    cardioNotes: "Dos paseos suaves.",
    sessions: [{
      id: "55555555-5555-4555-8555-555555555555",
      number: 1,
      name: "Torso A",
      exercises: [{
        id: "66666666-6666-4666-8666-666666666666",
        catalogExerciseId: null,
        muscleGroup: "Pectoral",
        name: "Press banca",
        referenceUrl: "",
        method: "Serie recta",
        sets: 3,
        reps: "8-10",
        targetRir: [2, 2, 1],
        rest: "2 min",
        cues: "Escápulas estables.",
      }],
    }],
  }],
};

describe("AssignmentsManager", () => {
  it("mantiene el histórico visible y abre la creación con un switch", () => {
    render(<AssignmentsManager kind="workout" clients={clients} assignments={assignments} templates={templates} workoutInitialPlan={structuredPlan} />);

    const toggle = screen.getByRole("switch", { name: "Mostrar formulario para crear entrenamiento" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("heading", { name: "Nuevo entrenamiento" })).not.toBeInTheDocument();
    expect(screen.queryByText("Hasta 10 registros por página.")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("heading", { name: "Nuevo entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Cliente del entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Estado del entrenamiento" })).toHaveTextContent("Publicado para el cliente");
    expect(screen.getByRole("textbox", { name: "Nombre del bloque" })).toHaveValue("Bloque de demostración");
    expect(screen.getByRole("button", { name: "Duplicar semana" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Contenido del plan" })).not.toBeInTheDocument();
    expect(document.querySelector('input[type="date"]')).not.toBeInTheDocument();
  });

  it("filtra ejercicios por músculo y completa sus claves", () => {
    render(<AssignmentsManager kind="workout" clients={clients.slice(0, 1)} assignments={[]} workoutInitialPlan={structuredPlan} exerciseCatalog={exerciseCatalog} />);
    fireEvent.click(screen.getByRole("switch", { name: "Mostrar formulario para crear entrenamiento" }));

    const muscleSelect = screen.getByRole("combobox", { name: "Grupo muscular del ejercicio 1" });
    fireEvent.focus(muscleSelect);
    fireEvent.click(screen.getByRole("option", { name: "CUÁDRICEPS" }));

    const exerciseSelect = screen.getByRole("combobox", { name: "Ejercicio 1" });
    fireEvent.focus(exerciseSelect);
    fireEvent.click(screen.getByRole("option", { name: "Sentadilla Hack" }));

    expect(screen.getByRole("textbox", { name: "Ejecución y observaciones" })).toHaveValue("Empuja la plataforma y controla la bajada.");
    expect(screen.getByRole("link", { name: /Ver técnica del ejercicio/ })).toHaveAttribute("href", exerciseCatalog[0].referenceUrl);
  });

  it("muestra y edita un entrenamiento estructurado desde el histórico", () => {
    const structuredAssignment: AdminAssignment = { ...assignments[0], planData: structuredPlan };
    render(<AssignmentsManager kind="workout" clients={clients.slice(0, 1)} assignments={[structuredAssignment]} workoutInitialPlan={structuredPlan} />);

    fireEvent.click(screen.getByRole("button", { name: "Ver entrenamiento Plan 1" }));
    const preview = screen.getByRole("dialog", { name: "Plan 1" });
    expect(preview).toHaveTextContent("Bloque de demostración");
    expect(preview).toHaveTextContent("Press banca");
    expect(preview).toHaveTextContent(/8.?000/);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar plan" }));

    fireEvent.click(screen.getByRole("button", { name: "Editar entrenamiento Plan 1" }));
    expect(screen.getByRole("button", { name: "Actualizar entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Nombre del bloque" })).toHaveValue("Bloque de demostración");
  });

  it("pagina el histórico cada diez registros", () => {
    render(<AssignmentsManager kind="nutrition" clients={clients} assignments={assignments} />);

    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(screen.getByText("Plan 11")).toBeInTheDocument();
    expect(screen.queryByText("Plan 1")).not.toBeInTheDocument();
  });

  it("permite filtrar y ordenar todas las columnas visibles", () => {
    render(<AssignmentsManager kind="workout" clients={clients} assignments={assignments} />);

    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));
    expect(document.querySelector("#workout-assignment-filters > div")?.className).toContain("repeat(auto-fit");
    expect(document.querySelectorAll(".assignments-table col")[4]).toHaveClass("w-[20%]");
    expect(screen.getAllByText("Publicado")[0].closest("td")).toHaveClass("overflow-hidden");
    fireEvent.change(screen.getByPlaceholderText("Título…"), { target: { value: "Plan 2" } });
    expect(screen.getByText("Plan 2")).toBeInTheDocument();
    expect(screen.queryByText("Plan 1")).not.toBeInTheDocument();
    expect(screen.getByText("1 de 11")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Restablecer" }));
    fireEvent.click(screen.getByRole("button", { name: "Ordenar Plan en orden ascendente" }));
    fireEvent.click(screen.getByRole("button", { name: "Ordenar Plan en orden descendente" }));
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Plan 11");
  });

  it("abre la lectura completa, la edición y la confirmación de eliminación sin mostrar versión", () => {
    render(<AssignmentsManager kind="workout" clients={clients.slice(0, 1)} assignments={assignments.slice(0, 1)} />);

    expect(screen.queryByText("Versión")).not.toBeInTheDocument();
    expect(screen.queryByText("v1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver entrenamiento Plan 1" }));
    expect(screen.getByRole("dialog", { name: "Plan 1" })).toHaveTextContent("Contenido completo del plan 1");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar plan" }));

    fireEvent.click(screen.getByRole("button", { name: "Editar entrenamiento Plan 1" }));
    expect(screen.getByRole("dialog", { name: "Plan 1" })).toHaveTextContent("Actualizar plan");
    expect(screen.getByRole("textbox", { name: "Contenido del plan" })).toHaveValue(assignments[0].content);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar edición del plan" }));

    fireEvent.click(screen.getByRole("button", { name: "Eliminar entrenamiento Plan 1" }));
    expect(screen.getByRole("alertdialog", { name: "Eliminar entrenamiento" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar plan" })).toBeInTheDocument();
  });

  it("conserva lectura y acciones en las vistas lista y galería", () => {
    render(<AssignmentsManager kind="nutrition" clients={clients.slice(0, 1)} assignments={assignments.slice(0, 1)} />);

    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver pauta nutricional Plan 1" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Galería" }));
    expect(screen.getByText(/Contenido completo del plan 1/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar pauta nutricional Plan 1" })).toBeInTheDocument();
  });

  it("permite editar y eliminar las plantillas desde su biblioteca interna", () => {
    render(<AssignmentsManager kind="workout" clients={clients.slice(0, 1)} assignments={assignments.slice(0, 1)} templates={templates} />);

    fireEvent.click(screen.getByRole("button", { name: "Gestionar plantillas (1)" }));
    expect(screen.getByRole("dialog", { name: /plantillas de entrenamiento/i })).toHaveTextContent("Base fuerza");

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    expect(screen.getByRole("dialog", { name: "Base fuerza" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Nombre de la plantilla" })).toHaveValue("Base fuerza");
    expect(screen.getByRole("textbox", { name: "Título del plan" })).toHaveValue("Fuerza base");
    expect(screen.getByRole("textbox", { name: "Contenido del plan" })).toHaveValue(templates[0].content);

    fireEvent.click(screen.getByRole("button", { name: "Volver a plantillas" }));
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByRole("alertdialog", { name: "Eliminar plantilla de entrenamiento" })).toHaveTextContent("Los planes ya creados no cambiarán");
    expect(screen.getByRole("button", { name: "Eliminar plantilla" })).toBeInTheDocument();
  });
});
