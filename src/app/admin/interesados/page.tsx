import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/layout/page-heading";
import { leadReference } from "@/lib/leads/reference";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createAdminClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, full_name, email, phone, goal, contact_preference, created_at, status")
    .order("created_at", { ascending: false })
    .limit(100);
  return <><PageHeading eyebrow="Captación" title="Interesados" description="Solicitudes recibidas desde el enlace privado de información. Cada envío guardado incluye una referencia para poder comprobarlo." />{leads?.length ? <Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Referencia</th><th>Contacto</th><th>Objetivo</th><th>Preferencia</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td className="font-mono text-xs font-black">{leadReference(lead.id)}</td><td><p className="font-black">{lead.full_name}</p><a className="block text-sm text-primary hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a><a className="text-sm text-muted hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a></td><td className="max-w-md whitespace-pre-wrap text-sm">{lead.goal}</td><td className="capitalize">{lead.contact_preference}</td><td>{formatDate(lead.created_at)}</td><td><Badge tone={lead.status === "new" ? "brand" : "neutral"}>{statusLabel(lead.status)}</Badge></td></tr>)}</tbody></table></div></Card> : <EmptyState icon={UserRound} title="No hay interesados todavía" description="Las nuevas solicitudes aparecerán aquí con la misma referencia mostrada al remitente." />}</>;
}
