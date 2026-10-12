import { ClipboardCheck, UserPlus, UsersRound, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/layout/page-heading";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const [clients, leads, checkIns, fees] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client").eq("status", "active"),
    supabase.from("leads").select("id, full_name, goal, created_at, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("check_ins").select("id", { count: "exact", head: true }),
    supabase.from("manual_fee_records").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  const stats = [
    { label: "Clientes activos", value: clients.count ?? 0, icon: UsersRound },
    { label: "Interesados nuevos", value: leads.data?.filter((lead) => lead.status === "new").length ?? 0, icon: UserPlus },
    { label: "Seguimientos", value: checkIns.count ?? 0, icon: ClipboardCheck },
    { label: "Cuotas pendientes", value: fees.count ?? 0, icon: WalletCards },
  ];

  return (
    <>
      <PageHeading eyebrow="Panel privado" title="Resumen" description="Vista rápida de clientes, solicitudes y tareas de seguimiento." />
      <div className="dashboard-grid">
        {stats.map(({ label, value, icon: Icon }) => <Card key={label} className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><Icon size={23} /></span><div><p className="text-3xl font-black">{value}</p><p className="text-sm font-bold text-muted">{label}</p></div></Card>)}
      </div>
      <Card className="mt-6">
        <div className="mb-5"><h2 className="text-xl font-black">Últimas solicitudes</h2><p className="mt-1 text-sm text-muted">Personas que han pedido información desde la landing.</p></div>
        {leads.data?.length ? <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Nombre</th><th>Objetivo</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>{leads.data.map((lead) => <tr key={lead.id}><td className="font-bold">{lead.full_name}</td><td className="max-w-sm truncate text-muted">{lead.goal}</td><td>{formatDate(lead.created_at)}</td><td><Badge tone={lead.status === "new" ? "brand" : "neutral"}>{lead.status === "new" ? "Nuevo" : lead.status}</Badge></td></tr>)}</tbody></table></div> : <p className="rounded-xl bg-surface-muted p-5 text-sm text-muted">Todavía no hay solicitudes.</p>}
      </Card>
    </>
  );
}
