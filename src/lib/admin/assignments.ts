import type { WorkoutPlan } from "@/lib/workouts/plan";

export type AssignmentStatus = "draft" | "published";

export type AdminAssignment = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  content: string;
  status: AssignmentStatus;
  startsOn: string | null;
  createdAt: string;
  planData?: WorkoutPlan | null;
};

export type AssignmentTemplate = {
  id: string;
  name: string;
  title: string;
  content: string;
};

export type AssignmentSortKey = "title" | "client" | "startsOn" | "status";
export type AssignmentSort = { key: AssignmentSortKey; direction: "asc" | "desc" } | null;
export type AssignmentFilters = {
  title: string;
  client: string;
  startsFrom: string;
  startsTo: string;
  status: "all" | AssignmentStatus;
};

export const emptyAssignmentFilters: AssignmentFilters = {
  title: "",
  client: "",
  startsFrom: "",
  startsTo: "",
  status: "all",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es").trim();
}

function effectiveStart(assignment: AdminAssignment) {
  return assignment.startsOn ?? assignment.createdAt.slice(0, 10);
}

function sortValue(assignment: AdminAssignment, key: AssignmentSortKey) {
  if (key === "title") return assignment.title;
  if (key === "client") return assignment.clientName;
  if (key === "startsOn") return effectiveStart(assignment);
  return assignment.status === "published" ? "Publicado" : "Borrador";
}

export function filterAndSortAssignments(
  assignments: AdminAssignment[],
  filters: AssignmentFilters,
  sort: AssignmentSort,
) {
  const title = normalize(filters.title);
  const client = normalize(filters.client);
  const filtered = assignments.filter((assignment) => {
    const start = effectiveStart(assignment);
    if (title && !normalize(assignment.title).includes(title)) return false;
    if (client && !normalize(assignment.clientName).includes(client)) return false;
    if (filters.startsFrom && start < filters.startsFrom) return false;
    if (filters.startsTo && start > filters.startsTo) return false;
    if (filters.status !== "all" && assignment.status !== filters.status) return false;
    return true;
  });

  if (!sort) return filtered;

  return [...filtered].sort((left, right) => {
    const comparison = sortValue(left, sort.key).localeCompare(
      sortValue(right, sort.key),
      "es",
      { sensitivity: "base", numeric: true },
    );
    return sort.direction === "asc" ? comparison : -comparison;
  });
}

export function nextAssignmentSort(
  current: AssignmentSort,
  key: AssignmentSortKey,
): AssignmentSort {
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}
