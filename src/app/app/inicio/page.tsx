import { Dumbbell, Salad, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function ClientHomePage() {
  const user = await requireClient();
  if (!user.onboardingComplete) redirect("/app/cuestionario");
  const supabase = await createClient();
  const [workout, nutrition, lastCheckIn] = await Promise.all([
    supabase.from("workout_assignments").select("id, title, starts_on").eq("client_id", user.id).eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("nutrition_assignments").select("id, title, starts_on").eq("client_id", user.id).eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("check_ins").select("id, created_at").eq("client_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  return <>
    <PageHeading eyebrow="Área personal" title={`Hola, ${user.fullName.split(" ")[0]}`} description="Aquí tienes tus planes y el acceso rápido a tu seguimiento." />
    <div className="dashboard-grid">
      <Card><Dumbbell className="text-primary" /><h2 className="mt-5 text-xl font-black">Entrenamiento</h2><p className="mt-2 min-h-12 text-sm leading-6 text-muted">{workout.data?.title ?? "Tu entrenador todavía no ha publicado un plan."}</p><ButtonLink className="mt-5" size="sm" variant="outline" href="/app/entrenamiento">Ver entrenamiento</ButtonLink></Card>
      <Card><Salad className="text-primary" /><h2 className="mt-5 text-xl font-black">Nutrición</h2><p className="mt-2 min-h-12 text-sm leading-6 text-muted">{nutrition.data?.title ?? "Tu entrenador todavía no ha publicado una pauta."}</p><ButtonLink className="mt-5" size="sm" variant="outline" href="/app/nutricion">Ver nutrición</ButtonLink></Card>
      <Card><TrendingUp className="text-primary" /><div className="mt-5 flex items-center justify-between gap-3"><h2 className="text-xl font-black">Seguimiento</h2>{lastCheckIn.data ? <Badge tone="success">Al día</Badge> : <Badge tone="warning">Pendiente</Badge>}</div><p className="mt-2 min-h-12 text-sm leading-6 text-muted">Cuéntale a tu entrenador cómo ha ido la semana para poder ajustar el plan.</p><ButtonLink className="mt-5" size="sm" href="/app/seguimiento">Enviar revisión</ButtonLink></Card>
    </div>
  </>;
}
