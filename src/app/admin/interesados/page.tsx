import { UserRound } from "lucide-react";
import { LeadsCatalog, type LeadCatalogItem } from "@/components/admin/leads-catalog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/layout/page-heading";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createAdminClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, full_name, email, phone, goal, contact_preference, created_at, status")
    .order("created_at", { ascending: false })
    .limit(100);
  return <><PageHeading eyebrow="Captación" title="Interesados" description="Solicitudes recibidas desde el enlace privado de información. Cada envío guardado incluye una referencia para poder comprobarlo." />{leads?.length ? <LeadsCatalog leads={leads as LeadCatalogItem[]} /> : <EmptyState icon={UserRound} title="No hay interesados todavía" description="Las nuevas solicitudes aparecerán aquí con la misma referencia mostrada al remitente." />}</>;
}
