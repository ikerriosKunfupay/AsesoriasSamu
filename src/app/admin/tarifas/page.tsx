import { Tags } from "lucide-react";
import {
  ArchivePricingPlanButton,
  PricingPlanForm,
} from "@/components/forms/commercial-terms-forms";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { PricingPlanOption } from "@/lib/admin/commercial-terms";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function PricingPlansPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("pricing_plans")
    .select("id, name, billing_cycle, duration_months, default_amount_eur, active")
    .eq("active", true)
    .order("name");
  const plans: PricingPlanOption[] = (data ?? []).map((plan) => ({
    id: plan.id,
    name: plan.name,
    billingCycle: plan.billing_cycle,
    durationMonths: plan.duration_months,
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
          Puedes crear Mensual, Semestral, Anual o cualquier tarifa personalizada. El importe se propone al asignarla, pero puede ajustarse por cliente.
        </p>
        <PricingPlanForm />
      </Card>
      {plans.length ? (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <PricingPlanForm plan={plan} />
              <div className="mt-4 border-t border-border pt-4">
                <ArchivePricingPlanButton pricingPlanId={plan.id} planName={plan.name} />
              </div>
            </Card>
          ))}
        </div>
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
