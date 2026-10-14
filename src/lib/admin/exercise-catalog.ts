export type ExerciseCatalogItem = {
  id: string;
  muscleGroup: string;
  name: string;
  referenceUrl: string;
  cues: string;
  muscleOrder: number;
  sourceOrder: number;
};

export function normalizeCatalogText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-ES")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterExerciseCatalog(
  catalog: ExerciseCatalogItem[],
  query: string,
  muscleGroup: string,
) {
  const normalizedQuery = normalizeCatalogText(query);
  return catalog.filter((exercise) => {
    if (muscleGroup && exercise.muscleGroup !== muscleGroup) return false;
    if (!normalizedQuery) return true;
    return normalizeCatalogText(`${exercise.name} ${exercise.muscleGroup} ${exercise.cues}`).includes(normalizedQuery);
  });
}
