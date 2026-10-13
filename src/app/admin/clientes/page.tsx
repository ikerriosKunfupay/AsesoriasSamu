import { UserPlus } from "lucide-react";
import { ClientsTable } from "@/components/admin/clients-table";
import { PageHeading } from "@/components/layout/page-heading";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { PricingPlanOption } from "@/lib/admin/commercial-terms";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, phone, status, onboarding_complete, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });
  const clientIds = clients?.map((client) => client.id) ?? [];
  const [{ data: noteRows }, { data: commercialRows }, { data: pricingRows }] = await Promise.all([
    clientIds.length
      ? supabase.from("client_admin_notes").select("client_id, notes").in("client_id", clientIds)
      : Promise.resolve({ data: [] }),
    clientIds.length
      ? supabase.from("client_commercial_terms").select("client_id, modality, pricing_plan_id, agreed_amount_eur").in("client_id", clientIds)
      : Promise.resolve({ data: [] }),
    supabase.from("pricing_plans").select("id, name, billing_cycle, duration_months, service_modality, days_per_week, default_amount_eur, active").order("name"),
  ]);
  const notesByClientId = new Map(noteRows?.map((row) => [row.client_id, row.notes]));
  const commercialByClientId = new Map(commercialRows?.map((row) => [row.client_id, row]));
  const pricingPlans: PricingPlanOption[] = (pricingRows ?? []).map((plan) => ({
    id: plan.id,
    name: plan.name,
    billingCycle: plan.billing_cycle,
    durationMonths: plan.duration_months,
    serviceModality: plan.service_modality,
    daysPerWeek: plan.days_per_week,
    defaultAmountEur: plan.default_amount_eur,
    active: plan.active,
  }));
  const pricingById = new Map(pricingPlans.map((plan) => [plan.id, plan]));

  return (
    <>
      <PageHeading
        eyebrow="Gestión"
        title="Clientes"
        description="Invita clientes, gestiona su alta o baja y consulta su planificación."
        action={(
          <ButtonLink href="/admin/clientes/nuevo">
            <UserPlus size={17} /> Invitar cliente
          </ButtonLink>
        )}
      />
      {clients?.length ? (
        <ClientsTable
          pricingPlans={pricingPlans}
          clients={clients.map((client) => {
            const terms = commercialByClientId.get(client.id);
            const pricingPlan = terms?.pricing_plan_id ? pricingById.get(terms.pricing_plan_id) : undefined;
            return {
              id: client.id,
              name: client.full_name || "Sin nombre",
              status: client.status,
              onboardingComplete: client.onboarding_complete,
              notes: notesByClientId.get(client.id) ?? "",
              modality: terms?.modality ?? null,
              pricingPlanId: terms?.pricing_plan_id ?? null,
              pricingPlanName: pricingPlan?.name ?? "",
              billingCycle: pricingPlan?.billingCycle ?? null,
              agreedAmountEur: terms?.agreed_amount_eur ?? null,
            };
          })}
        />
      ) : (
        <EmptyState
          icon={UserPlus}
          title="Aún no hay clientes"
          description="Invita al primer cliente para que cree su contraseña y complete el cuestionario inicial."
          action={<ButtonLink href="/admin/clientes/nuevo">Invitar cliente</ButtonLink>}
        />
      )}
    </>
  );
}
