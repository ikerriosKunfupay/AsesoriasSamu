import type { ProfileStatus } from "@/lib/supabase/database.types";

export type ClientTableItem = {
  id: string;
  name: string;
  status: ProfileStatus;
  onboardingComplete: boolean;
  notes: string;
};

export type ClientTableSortKey = "name" | "status" | "questionnaire" | "notes";
export type ClientTableSort = { key: ClientTableSortKey; direction: "asc" | "desc" } | null;

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es").trim();
}

function statusLabel(item: ClientTableItem) {
  return item.status === "active" ? "Activo" : "Inactivo";
}

function questionnaireLabel(item: ClientTableItem) {
  return item.onboardingComplete ? "Completado" : "Pendiente";
}

function sortValue(item: ClientTableItem, key: ClientTableSortKey) {
  if (key === "name") return item.name;
  if (key === "status") return statusLabel(item);
  if (key === "questionnaire") return questionnaireLabel(item);
  return item.notes;
}

export function filterAndSortClients(
  clients: ClientTableItem[],
  query: string,
  sort: ClientTableSort,
) {
  const normalizedQuery = normalize(query);
  const filtered = normalizedQuery
    ? clients.filter((client) => normalize([
        client.name,
        statusLabel(client),
        questionnaireLabel(client),
        client.notes,
      ].join(" ")).includes(normalizedQuery))
    : clients;

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

export function nextClientTableSort(
  current: ClientTableSort,
  key: ClientTableSortKey,
): ClientTableSort {
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}
