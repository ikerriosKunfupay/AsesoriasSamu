import { WalletCards } from "lucide-react";
import { FeeForm } from "@/components/forms/admin-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/layout/page-heading";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney, statusLabel } from "@/lib/format";

export default async function FeesPage() {
  const supabase = createAdminClient();
  const [{ data: clients }, { data: fees }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").eq("role", "client").neq("status", "archived").order("full_name"),
    supabase.from("manual_fee_records").select("id, client_id, period, amount_eur, status, notes").order("period", { ascending: false }),
  ]);
  const names = new Map(clients?.map((p) => [p.id, p.full_name]));
  return <><PageHeading eyebrow="Control interno" title="Cuotas" description="Registro manual del estado de las cuotas. No hay pagos ni datos bancarios dentro de la aplicación." /><div className="grid gap-6 xl:grid-cols-[420px_1fr]"><Card><h2 className="mb-5 text-xl font-black">Registrar cuota</h2><FeeForm clients={clients ?? []} /></Card><div>{fees?.length ? <Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Periodo</th><th>Cliente</th><th>Importe</th><th>Estado</th></tr></thead><tbody>{fees.map((fee) => <tr key={fee.id}><td className="font-bold">{fee.period}</td><td>{names.get(fee.client_id) ?? "Cliente"}</td><td>{formatMoney(fee.amount_eur)}</td><td><Badge tone={fee.status === "paid" ? "success" : fee.status === "pending" ? "warning" : "neutral"}>{statusLabel(fee.status)}</Badge></td></tr>)}</tbody></table></div></Card> : <EmptyState icon={WalletCards} title="No hay cuotas registradas" description="Añade el primer registro manual desde el formulario." />}</div></div></>;
}
