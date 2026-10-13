import { Salad } from "lucide-react";
import { PlanView } from "@/components/client/plan-view";
import { PageHeading } from "@/components/layout/page-heading";
import { requireCompletedClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function ClientNutritionPage() {
  const user = await requireCompletedClient();
  const supabase = await createClient();
  const { data } = await supabase.from("nutrition_assignments").select("title, content, starts_on, updated_at").eq("client_id", user.id).eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle();
  return <><PageHeading eyebrow="Mi plan" title="Nutrición" description="Consulta aquí tu pauta nutricional actualizada." /><PlanView plan={data} icon={Salad} emptyTitle="Aún no hay pauta publicada" emptyDescription="Tu entrenador está preparando la pauta. Aparecerá aquí cuando esté lista." /></>;
}
