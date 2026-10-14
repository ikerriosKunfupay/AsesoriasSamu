import { ArrowLeft } from "lucide-react";
import { ExerciseCatalogManager } from "@/components/admin/exercise-catalog-manager";
import { PageHeading } from "@/components/layout/page-heading";
import { ButtonLink } from "@/components/ui/button";
import type { ExerciseCatalogItem } from "@/lib/admin/exercise-catalog";
import { requireAdmin } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ExerciseCatalogPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("exercise_catalog")
    .select("id, muscle_group, name, reference_url, cues, muscle_order, source_order")
    .order("muscle_order")
    .order("source_order")
    .order("name");
  const catalog: ExerciseCatalogItem[] = (data ?? []).map((item) => ({
    id: item.id,
    muscleGroup: item.muscle_group,
    name: item.name,
    referenceUrl: item.reference_url ?? "",
    cues: item.cues,
    muscleOrder: item.muscle_order,
    sourceOrder: item.source_order,
  }));

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1400px]">
      <PageHeading
        eyebrow="Entrenamientos"
        title="Biblioteca de ejercicios"
        description="Busca por músculo o nombre y administra las claves que se completan al crear un entrenamiento."
        action={<ButtonLink href="/admin/entrenamientos" variant="outline"><ArrowLeft aria-hidden="true" className="size-4" />Volver a entrenamientos</ButtonLink>}
      />
      <ExerciseCatalogManager catalog={catalog} />
    </div>
  );
}
