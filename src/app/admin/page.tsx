import { DashboardAnalytics } from "@/components/admin/dashboard-analytics";
import { DashboardKpis, type DashboardKpi } from "@/components/admin/dashboard-kpis";
import { PageHeading } from "@/components/layout/page-heading";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import { daysPerWeekLabel, serviceModalityLabel } from "@/lib/admin/commercial-terms";
import type { AnalyticsClient, AnalyticsFee } from "@/lib/admin/dashboard-analytics";
import { requireAdmin } from "@/lib/auth/current-user";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_MODAL_ITEMS = 10;

function contactPreferenceLabel(value: string) {
  if (value === "whatsapp") return "WhatsApp";
  if (value === "phone" || value === "call") return "Llamada";
  if (value === "email") return "Correo";
  return value;
}

export default async function AdminDashboardPage() {
  const adminUser = await requireAdmin();
  const supabase = createAdminClient();
  const now = new Date();
  const referenceDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const referencePeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const analyticsStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const analyticsStartPeriod = `${analyticsStart.getFullYear()}-${String(analyticsStart.getMonth() + 1).padStart(2, "0")}`;
  const [clients, leads, questionnaires, checkIns, fees, commercialTerms, pricingPlans, analyticsFees, dashboardSettings] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, status, onboarding_complete, created_at", { count: "exact" })
      .eq("role", "client")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, full_name, contact_preference, status, created_at", { count: "exact" })
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(MAX_MODAL_ITEMS),
    supabase
      .from("onboarding_submissions")
      .select("id, user_id, submitted_at, updated_at", { count: "exact" })
      .order("updated_at", { ascending: false })
      .limit(MAX_MODAL_ITEMS),
    supabase
      .from("check_ins")
      .select("id, client_id, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(MAX_MODAL_ITEMS),
    supabase
      .from("manual_fee_records")
      .select("id, client_id, period, amount_eur, updated_at", { count: "exact" })
      .eq("status", "pending")
      .order("updated_at", { ascending: false })
      .limit(MAX_MODAL_ITEMS),
    supabase.from("client_commercial_terms").select("client_id, modality, pricing_plan_id, agreed_amount_eur"),
    supabase.from("pricing_plans").select("id, name, billing_cycle, duration_months, service_modality, days_per_week"),
    supabase
      .from("manual_fee_records")
      .select("id, client_id, period, amount_eur, status, updated_at")
      .gte("period", analyticsStartPeriod)
      .lte("period", referencePeriod)
      .order("period"),
    supabase
      .from("admin_dashboard_settings")
      .select("monthly_revenue_goal_eur, active_clients_goal")
      .eq("admin_id", adminUser.id)
      .maybeSingle(),
  ]);

  const relatedClientIds = Array.from(
    new Set([
      ...(questionnaires.data ?? []).map((item) => item.user_id),
      ...(checkIns.data ?? []).map((item) => item.client_id),
      ...(fees.data ?? []).map((item) => item.client_id),
    ]),
  );
  const relatedProfiles = relatedClientIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", relatedClientIds)
    : { data: [] as Array<{ id: string; full_name: string }> };
  const namesById = new Map((relatedProfiles.data ?? []).map((profile) => [profile.id, profile.full_name]));

  const kpis: DashboardKpi[] = [
    {
      key: "clients",
      label: "Clientes registrados",
      value: clients.count ?? 0,
      viewAllHref: "/admin/clientes",
      hasMore: (clients.count ?? 0) > MAX_MODAL_ITEMS,
      emptyMessage: "Todavía no hay clientes registrados.",
      items: (clients.data ?? []).slice(0, MAX_MODAL_ITEMS).map((client) => ({
        id: client.id,
        title: client.full_name,
        detail: `${statusLabel(client.status)} · ${client.onboarding_complete ? "Cuestionario completado" : "Cuestionario pendiente"}`,
        date: formatDate(client.created_at),
        href: getClientDetailHref(client.id, "/admin"),
      })),
    },
    {
      key: "leads",
      label: "Interesados nuevos",
      value: leads.count ?? 0,
      viewAllHref: "/admin/interesados",
      hasMore: (leads.count ?? 0) > MAX_MODAL_ITEMS,
      emptyMessage: "Todavía no hay interesados nuevos.",
      items: (leads.data ?? []).map((lead) => ({
        id: lead.id,
        title: lead.full_name,
        detail: `${contactPreferenceLabel(lead.contact_preference)} · ${statusLabel(lead.status)}`,
        date: formatDate(lead.created_at),
        href: `/admin/interesados#interesado-${lead.id}`,
      })),
    },
    {
      key: "questionnaires",
      label: "Cuestionarios recibidos",
      value: questionnaires.count ?? 0,
      viewAllHref: "/admin/clientes",
      hasMore: (questionnaires.count ?? 0) > MAX_MODAL_ITEMS,
      emptyMessage: "Todavía no hay cuestionarios recibidos.",
      items: (questionnaires.data ?? []).map((questionnaire) => ({
        id: questionnaire.id,
        title: namesById.get(questionnaire.user_id) ?? "Cliente",
        detail: "Cuestionario inicial recibido",
        date: formatDate(questionnaire.updated_at || questionnaire.submitted_at),
        href: getClientDetailHref(questionnaire.user_id, "/admin", "cuestionario"),
      })),
    },
    {
      key: "check-ins",
      label: "Seguimientos",
      value: checkIns.count ?? 0,
      viewAllHref: "/admin/seguimientos",
      hasMore: (checkIns.count ?? 0) > MAX_MODAL_ITEMS,
      emptyMessage: "Todavía no hay seguimientos.",
      items: (checkIns.data ?? []).map((checkIn) => ({
        id: checkIn.id,
        title: namesById.get(checkIn.client_id) ?? "Cliente",
        detail: "Seguimiento semanal recibido",
        date: formatDate(checkIn.created_at),
        href: `/admin/seguimientos#seguimiento-${checkIn.id}`,
      })),
    },
    {
      key: "fees",
      label: "Cuotas pendientes",
      value: fees.count ?? 0,
      viewAllHref: "/admin/cuotas",
      hasMore: (fees.count ?? 0) > MAX_MODAL_ITEMS,
      emptyMessage: "No hay cuotas pendientes.",
      items: (fees.data ?? []).map((fee) => ({
        id: fee.id,
        title: namesById.get(fee.client_id) ?? "Cliente",
        detail: `${fee.period} · ${formatMoney(fee.amount_eur)}`,
        date: formatDate(fee.updated_at),
        href: `/admin/cuotas#cuota-${fee.id}`,
      })),
    },
  ];

  const termsByClientId = new Map((commercialTerms.data ?? []).map((terms) => [terms.client_id, terms]));
  const plansById = new Map((pricingPlans.data ?? []).map((plan) => [plan.id, plan]));
  const analyticsClients: AnalyticsClient[] = (clients.data ?? []).map((client) => {
    const terms = termsByClientId.get(client.id);
    const plan = terms?.pricing_plan_id ? plansById.get(terms.pricing_plan_id) : undefined;
    return {
      id: client.id,
      name: client.full_name || "Cliente",
      status: client.status,
      createdAt: client.created_at,
      modality: terms?.modality ?? null,
      pricingPlanId: terms?.pricing_plan_id ?? null,
      pricingPlanName: plan
        ? `${plan.name} · ${serviceModalityLabel(plan.service_modality)} · ${daysPerWeekLabel(plan.days_per_week)}`
        : "",
      billingCycle: plan?.billing_cycle ?? null,
      durationMonths: plan?.duration_months ?? null,
      agreedAmountEur: terms?.agreed_amount_eur ?? null,
    };
  });
  const dashboardFees: AnalyticsFee[] = (analyticsFees.data ?? []).map((fee) => ({
    id: fee.id,
    clientId: fee.client_id,
    period: fee.period,
    amountEur: fee.amount_eur,
    status: fee.status,
    updatedAt: fee.updated_at,
  }));
  const goals = {
    monthlyRevenueGoalEur: dashboardSettings.data?.monthly_revenue_goal_eur ?? 0,
    activeClientsGoal: dashboardSettings.data?.active_clients_goal ?? 0,
  };

  return (
    <>
      <PageHeading eyebrow="Panel privado" title="Resumen" description="Consulta la actividad, el valor de tus asesorías, las previsiones y el avance de tus objetivos." />
      <DashboardKpis kpis={kpis} />
      <DashboardAnalytics clients={analyticsClients} fees={dashboardFees} goals={goals} referenceDate={referenceDate} />
    </>
  );
}
