import { describe, expect, it } from "vitest";
import {
  emptyAssignmentFilters,
  filterAndSortAssignments,
  nextAssignmentSort,
  type AdminAssignment,
} from "./assignments";

const assignments: AdminAssignment[] = [
  { id: "1", clientId: "c1", clientName: "Álvaro", title: "Fuerza", content: "Contenido de fuerza suficiente", status: "published", startsOn: "2026-10-15", createdAt: "2026-10-14T10:00:00.000Z" },
  { id: "2", clientId: "c2", clientName: "Bea", title: "Movilidad", content: "Contenido de movilidad suficiente", status: "draft", startsOn: "2026-11-01", createdAt: "2026-10-13T10:00:00.000Z" },
  { id: "3", clientId: "c3", clientName: "Carlos", title: "Cardio", content: "Contenido de cardio suficiente", status: "published", startsOn: null, createdAt: "2026-09-20T10:00:00.000Z" },
];

describe("filtro y orden de planes", () => {
  it("filtra todas las columnas visibles", () => {
    expect(filterAndSortAssignments(assignments, { ...emptyAssignmentFilters, title: "fuer" }, null).map((item) => item.id)).toEqual(["1"]);
    expect(filterAndSortAssignments(assignments, { ...emptyAssignmentFilters, client: "alvaro" }, null).map((item) => item.id)).toEqual(["1"]);
    expect(filterAndSortAssignments(assignments, { ...emptyAssignmentFilters, status: "draft" }, null).map((item) => item.id)).toEqual(["2"]);
    expect(filterAndSortAssignments(assignments, { ...emptyAssignmentFilters, startsFrom: "2026-10-01", startsTo: "2026-10-31" }, null).map((item) => item.id)).toEqual(["1"]);
  });

  it("ordena en ambos sentidos y restaura el orden original", () => {
    expect(filterAndSortAssignments(assignments, emptyAssignmentFilters, { key: "client", direction: "desc" }).map((item) => item.id)).toEqual(["3", "2", "1"]);
    expect(filterAndSortAssignments(assignments, emptyAssignmentFilters, { key: "startsOn", direction: "asc" }).map((item) => item.id)).toEqual(["3", "1", "2"]);
    expect(filterAndSortAssignments(assignments, emptyAssignmentFilters, null).map((item) => item.id)).toEqual(["1", "2", "3"]);
  });

  it("recorre ascendente, descendente y orden original", () => {
    const ascending = nextAssignmentSort(null, "title");
    const descending = nextAssignmentSort(ascending, "title");
    expect(ascending).toEqual({ key: "title", direction: "asc" });
    expect(descending).toEqual({ key: "title", direction: "desc" });
    expect(nextAssignmentSort(descending, "title")).toBeNull();
  });
});
