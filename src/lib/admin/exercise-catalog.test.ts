import { describe, expect, it } from "vitest";
import { filterExerciseCatalog, type ExerciseCatalogItem } from "./exercise-catalog";

const catalog: ExerciseCatalogItem[] = [
  { id: "1", muscleGroup: "CUÁDRICEPS", name: "Sentadilla Hack", referenceUrl: "", cues: "Empuja con los pies", muscleOrder: 1, sourceOrder: 1 },
  { id: "2", muscleGroup: "PECTORAL", name: "Press inclinado", referenceUrl: "", cues: "Escápulas estables", muscleOrder: 2, sourceOrder: 2 },
];

describe("filterExerciseCatalog", () => {
  it("busca sin distinguir mayúsculas ni tildes", () => {
    expect(filterExerciseCatalog(catalog, "cuadriceps", "")).toEqual([catalog[0]]);
    expect(filterExerciseCatalog(catalog, "escapulas", "")).toEqual([catalog[1]]);
  });

  it("combina la búsqueda con el grupo muscular", () => {
    expect(filterExerciseCatalog(catalog, "press", "CUÁDRICEPS")).toEqual([]);
    expect(filterExerciseCatalog(catalog, "", "PECTORAL")).toEqual([catalog[1]]);
  });
});
