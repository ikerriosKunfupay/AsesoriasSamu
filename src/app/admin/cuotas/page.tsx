import { FeesManager } from "@/components/admin/fees-manager";
import { PageHeading } from "@/components/layout/page-heading";
import type { AdminFee, FeeStatus } from "@/lib/admin/fees";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function FeesPage() {
  const supabase = createAdminClient();
  const [{ data: clients }, { data: fees }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "client")
      .neq("status", "archived")
      .order("full_name"),
    supabase
      .from("manual_fee_records")
      .select("id, client_id, period, amount_eur, status, notes")
      .order("period", { ascending: false })
      .order("updated_at", { ascending: false }),
  ]);

  const clientOptions = (clients ?? []).map((client) => ({
    id: client.id,
    full_name: client.full_name || "Cliente sin nombre",
  }));
  const names = new Map(clientOptions.map((client) => [client.id, client.full_name]));
  const feeRecords: AdminFee[] = (fees ?? []).map((fee) => ({
    id: fee.id,
    clientId: fee.client_id,
    clientName: names.get(fee.client_id) ?? "Cliente",
    period: fee.period,
    amountEur: fee.amount_eur,
    status: fee.status as FeeStatus,
    notes: fee.notes ?? "",
  }));

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
      <PageHeading
        eyebrow="Control interno"
        title="Cuotas"
      />
      <FeesManager clients={clientOptions} fees={feeRecords} />
    </div>
  );
}
