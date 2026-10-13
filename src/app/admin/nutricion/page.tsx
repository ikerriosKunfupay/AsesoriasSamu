import { Salad } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/layout/page-heading";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, statusLabel } from "@/lib/format";

export default async function NutritionPage() {
  const supabase = createAdminClient();
  const { data: plans } = await supabase.from("nutrition_assignments").select("id, client_id, title, status, version, starts_on, created_at").order("created_at", { ascending: false });
  const ids = [...new Set(plans?.map((p) => p.client_id) ?? [])];
  const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, full_name").in("id", ids) : { data: [] };
  const names = new Map(profiles?.map((p) => [p.id, p.full_name]));
  return <><PageHeading eyebrow="Planificación" title="Nutrición" description="Histórico de pautas nutricionales asignadas." />{plans?.length ? <Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Plan</th><th>Cliente</th><th>Inicio</th><th>Versión</th><th>Estado</th></tr></thead><tbody>{plans.map((plan) => <tr key={plan.id}><td className="font-black">{plan.title}</td><td><Link className="text-primary hover:underline" href={getClientDetailHref(plan.client_id, "/admin/nutricion")}>{names.get(plan.client_id) ?? "Cliente"}</Link></td><td>{formatDate(plan.starts_on ?? plan.created_at)}</td><td>v{plan.version}</td><td><Badge tone={plan.status === "published" ? "success" : "neutral"}>{statusLabel(plan.status)}</Badge></td></tr>)}</tbody></table></div></Card> : <EmptyState icon={Salad} title="Aún no hay pautas" description="Crea la primera pauta desde la ficha de un cliente." />}</>;
}
