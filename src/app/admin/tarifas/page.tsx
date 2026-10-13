import { Tags } from "lucide-react";
import { PricingPlansCatalog } from "@/components/admin/pricing-plans-catalog";
import { PricingPlanForm } from "@/components/forms/commercial-terms-forms";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { PricingPlanOption } from "@/lib/admin/commercial-terms";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function PricingPlansPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("pricing_plans")
    .select("id, name, billing_cycle, duration_months, service_modality, days_per_week, default_amount_eur, active")
    .eq("active", true)
    .order("name");
  const plans: PricingPlanOption[] = (data ?? []).map((plan) => ({
    id: plan.id,
    name: plan.name,
    billingCycle: plan.billing_cycle,
    durationMonths: plan.duration_months,
    serviceModality: plan.service_modality,
    daysPerWeek: plan.days_per_week,
    defaultAmountEur: plan.default_amount_eur,
    active: plan.active,
  }));

  return (
    <>
      <PageHeading
        eyebrow="Control interno"
        title="Tarifas"
        description="Gestiona los precios habituales disponibles al asignar condiciones a cada cliente."
      />
      <Card className="mb-6">
        <h2 className="mb-2 text-xl font-black">Crear tarifa</h2>
        <p className="mb-5 text-sm text-muted">
          Cada plantilla combina modalidad, días por semana, periodicidad y precio. El importe se propone al asignarla, pero puede ajustarse por cliente.
        </p>
        <PricingPlanForm />
      </Card>
      {plans.length ? (
        <PricingPlansCatalog plans={plans} />
      ) : (
        <EmptyState
          icon={Tags}
          title="Aún no hay tarifas"
          description="Crea la primera para poder seleccionarla desde la ficha o la tabla de clientes."
        />
      )}
    </>
  );
}
