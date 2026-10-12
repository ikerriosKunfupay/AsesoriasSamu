import Link from "next/link";
import { UserPlus } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { createAdminClient } from "@/lib/supabase/admin";
import { statusLabel } from "@/lib/format";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data: clients } = await supabase.from("profiles").select("id, full_name, phone, status, onboarding_complete, created_at").eq("role", "client").order("created_at", { ascending: false });
  return <>
    <PageHeading eyebrow="Gestión" title="Clientes" description="Invita clientes y consulta su planificación y seguimiento." action={<ButtonLink href="/admin/clientes/nuevo"><UserPlus size={17} /> Invitar cliente</ButtonLink>} />
    {clients?.length ? <Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Cliente</th><th>Estado</th><th>Cuestionario</th><th></th></tr></thead><tbody>{clients.map((client) => <tr key={client.id}><td><Link className="font-black hover:text-primary" href={`/admin/clientes/${client.id}`}>{client.full_name || "Sin nombre"}</Link></td><td><Badge tone={client.status === "active" ? "success" : client.status === "invited" ? "warning" : "neutral"}>{statusLabel(client.status)}</Badge></td><td>{client.onboarding_complete ? "Completado" : "Pendiente"}</td><td className="text-right"><ButtonLink href={`/admin/clientes/${client.id}`} size="sm" variant="outline">Ver ficha</ButtonLink></td></tr>)}</tbody></table></div></Card> : <EmptyState icon={UserPlus} title="Aún no hay clientes" description="Invita al primer cliente para que cree su contraseña y complete el cuestionario inicial." action={<ButtonLink href="/admin/clientes/nuevo">Invitar cliente</ButtonLink>} />}
  </>;
}
