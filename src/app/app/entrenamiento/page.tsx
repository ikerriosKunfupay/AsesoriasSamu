import { Dumbbell } from "lucide-react";
import { PlanView } from "@/components/client/plan-view";
import { PageHeading } from "@/components/layout/page-heading";
import { requireClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function ClientWorkoutPage() {
  const user = await requireClient();
  const supabase = await createClient();
  const { data } = await supabase.from("workout_assignments").select("title, content, starts_on, updated_at").eq("client_id", user.id).eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle();
  return <><PageHeading eyebrow="Mi plan" title="Entrenamiento" description="Consulta siempre aquí la versión más reciente de tu planificación." /><PlanView plan={data} icon={Dumbbell} emptyTitle="Aún no hay entrenamiento publicado" emptyDescription="Tu entrenador está preparando el plan. Aparecerá aquí cuando esté listo." /></>;
}
