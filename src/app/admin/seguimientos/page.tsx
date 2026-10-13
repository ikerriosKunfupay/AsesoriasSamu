import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/layout/page-heading";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export default async function CheckInsPage() {
  const supabase = createAdminClient();
  const { data: items } = await supabase.from("check_ins").select("id, client_id, weight_kg, energy_level, adherence_level, notes, created_at").order("created_at", { ascending: false });
  const ids = [...new Set(items?.map((item) => item.client_id) ?? [])];
  const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, full_name").in("id", ids) : { data: [] };
  const names = new Map(profiles?.map((p) => [p.id, p.full_name]));
  return <><PageHeading eyebrow="Evolución" title="Seguimientos" description="Revisiones enviadas por los clientes, de más reciente a más antigua." />{items?.length ? <div className="grid gap-4">{items.map((item) => <Card key={item.id} id={`seguimiento-${item.id}`} className="scroll-mt-24 target:ring-2 target:ring-primary"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><Link className="text-lg font-black hover:text-primary" href={getClientDetailHref(item.client_id, "/admin/seguimientos")}>{names.get(item.client_id) ?? "Cliente"}</Link><p className="mt-1 text-sm text-muted">{formatDate(item.created_at)}{item.weight_kg ? ` · ${item.weight_kg} kg` : ""}</p></div><p className="font-bold">Energía {item.energy_level}/5 · Adherencia {item.adherence_level}/5</p></div>{item.notes ? <p className="mt-4 whitespace-pre-wrap rounded-xl bg-surface-muted p-4 text-sm leading-6">{item.notes}</p> : null}</Card>)}</div> : <EmptyState icon={TrendingUp} title="Aún no hay seguimientos" description="Las revisiones semanales que envíen los clientes aparecerán aquí." />}</>;
}
