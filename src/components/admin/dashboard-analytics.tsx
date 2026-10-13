"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Banknote,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Goal,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { saveDashboardGoalsAction } from "@/app/actions/admin";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import {
  buildDashboardAnalytics,
  filterAnalyticsClients,
  monthlyEquivalent,
  type AnalyticsClient,
  type AnalyticsFee,
  type AnalyticsFilters,
  type DashboardGoals,
} from "@/lib/admin/dashboard-analytics";
import { getClientDetailHref } from "@/lib/admin/client-navigation";
import { initialActionState } from "@/lib/forms/action-state";
import { formatMoney } from "@/lib/format";

const chartColors = ["var(--primary)", "#2563eb", "#f59e0b", "#16a34a", "#8b5cf6", "#6b7280"];
const analyticsSelectClassName = "min-h-11 text-sm font-bold";
const periodOptions = [
  { value: "3", label: "Últimos 3 meses" },
  { value: "6", label: "Últimos 6 meses" },
  { value: "12", label: "Últimos 12 meses" },
] as const;
const modalityOptions = [
  { value: "all", label: "Todas las modalidades" },
  { value: "in_person", label: "Presencial" },
  { value: "online", label: "Virtual" },
] as const;
const tooltipStyle = { background: "var(--surface)", borderColor: "var(--border)", borderRadius: 12, color: "var(--foreground)" };

type AnalyticsMetricKey = "collected" | "recurring" | "forecast" | "pending" | "average" | "active";

type AnalyticsMetricItem = {
  id: string;
  title: string;
  detail: string;
  value: string;
  href?: string;
};

type AnalyticsMetricDialog = {
  key: AnalyticsMetricKey;
  label: string;
  value: string;
  description: string;
  emptyMessage: string;
  items: AnalyticsMetricItem[];
  totalItems: number;
  viewAllHref?: string;
};

function compactMoney(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function modalityLabel(modality: AnalyticsClient["modality"]) {
  if (modality === "in_person") return "Presencial";
  if (modality === "online") return "Virtual";
  return "Sin modalidad";
}

function formatPeriod(period: string) {
  const [year, month] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}

function MetricCard({
  metricKey,
  label,
  value,
  detail,
  icon: Icon,
  expanded,
  onOpen,
}: {
  metricKey: AnalyticsMetricKey;
  label: string;
  value: string;
  detail: string;
  icon: typeof Banknote;
  expanded: boolean;
  onOpen: (key: AnalyticsMetricKey, trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={(event) => onOpen(metricKey, event.currentTarget)}
      className="group relative min-w-0 rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-1 break-words text-2xl font-black">{value}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
        </div>
      </div>
      <ChevronRight className="absolute right-3 top-3 size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
    </button>
  );
}

function GoalProgress({ label, value, target, progress }: { label: string; value: string; target: string; progress: number }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4 text-sm">
        <div><p className="font-black">{label}</p><p className="text-muted">{value} de {target}</p></div>
        <b>{Math.round(progress)}%</b>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function DashboardGoalsForm({ goals }: { goals: DashboardGoals }) {
  const [state, action] = useActionState(saveDashboardGoalsAction, initialActionState);
  return (
    <form action={action} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Objetivo mensual de ingresos (€)
          <Input
            name="monthlyRevenueGoalEur"
            inputMode="decimal"
            defaultValue={String(goals.monthlyRevenueGoalEur).replace(".", ",")}
            aria-invalid={Boolean(state.fieldErrors?.monthlyRevenueGoalEur)}
          />
          {state.fieldErrors?.monthlyRevenueGoalEur?.[0] ? <span className="text-xs text-danger">{state.fieldErrors.monthlyRevenueGoalEur[0]}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-black">
          Objetivo de clientes activos
          <Input
            name="activeClientsGoal"
            type="number"
            min={0}
            step={1}
            defaultValue={goals.activeClientsGoal}
            aria-invalid={Boolean(state.fieldErrors?.activeClientsGoal)}
          />
          {state.fieldErrors?.activeClientsGoal?.[0] ? <span className="text-xs text-danger">{state.fieldErrors.activeClientsGoal[0]}</span> : null}
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Guardando…">Guardar objetivos</SubmitButton>
        <span className="text-xs text-muted">Son objetivos privados del administrador y se pueden cambiar cuando quieras.</span>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

export function DashboardAnalytics({
  clients,
  fees,
  goals,
  referencePeriod,
}: {
  clients: AnalyticsClient[];
  fees: AnalyticsFee[];
  goals: DashboardGoals;
  referencePeriod: string;
}) {
  const [filters, setFilters] = useState<AnalyticsFilters>({ months: 6, modality: "all", pricingPlanId: "all" });
  const [activeMetricKey, setActiveMetricKey] = useState<AnalyticsMetricKey | null>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const analytics = useMemo(
    () => buildDashboardAnalytics({ clients, fees, filters, referencePeriod, goals }),
    [clients, fees, filters, goals, referencePeriod],
  );
  const pricingPlans = useMemo(() => (
    Array.from(new Map(clients.filter((client) => client.pricingPlanId).map((client) => [
      client.pricingPlanId!,
      client.pricingPlanName,
    ])).entries()).sort((left, right) => left[1].localeCompare(right[1], "es"))
  ), [clients]);
  const metricDialogs = useMemo(() => {
    const filteredClients = filterAnalyticsClients(clients, filters);
    const filteredClientIds = new Set(filteredClients.map((client) => client.id));
    const clientNames = new Map(filteredClients.map((client) => [client.id, client.name]));
    const activeClients = filteredClients.filter((client) => client.status === "active");
    const contractedClients = activeClients.filter((client) => client.agreedAmountEur != null);
    const clientItems = (source: AnalyticsClient[]): AnalyticsMetricItem[] => source
      .map((client) => ({
        id: client.id,
        title: client.name,
        detail: `${client.pricingPlanName || "Sin tarifa"} · ${modalityLabel(client.modality)}`,
        value: client.agreedAmountEur == null
          ? "Sin precio"
          : `${formatMoney(monthlyEquivalent(client.agreedAmountEur, client.durationMonths))}/mes`,
        href: getClientDetailHref(client.id, "/admin"),
      }))
      .sort((left, right) => left.title.localeCompare(right.title, "es"));
    const feeItems = (status: "paid" | "pending"): AnalyticsMetricItem[] => fees
      .filter((fee) => (
        filteredClientIds.has(fee.clientId)
        && fee.period === referencePeriod
        && fee.status === status
      ))
      .map((fee) => ({
        id: fee.id,
        title: clientNames.get(fee.clientId) ?? "Cliente",
        detail: `${formatPeriod(fee.period)} · ${status === "paid" ? "Pagada" : "Pendiente"}`,
        value: formatMoney(fee.amountEur),
        href: `/admin/cuotas#cuota-${encodeURIComponent(fee.id)}`,
      }))
      .sort((left, right) => left.title.localeCompare(right.title, "es"));
    const paidItems = feeItems("paid");
    const pendingItems = feeItems("pending");
    const recurringItems = clientItems(activeClients);
    const averageItems = clientItems(contractedClients);
    const historicalItems: AnalyticsMetricItem[] = analytics.revenueSeries
      .slice(0, -1)
      .slice(-6)
      .reverse()
      .map((period) => ({
        id: period.period,
        title: formatPeriod(period.period),
        detail: "Importe marcado como cobrado",
        value: formatMoney(period.collected),
      }));
    const modality = filters.modality === "all" ? "todas las modalidades" : modalityLabel(filters.modality);
    const selectedPlan = filters.pricingPlanId === "all"
      ? "todas las tarifas"
      : filters.pricingPlanId === "unassigned"
        ? "clientes sin tarifa"
        : pricingPlans.find(([id]) => id === filters.pricingPlanId)?.[1] ?? "tarifa seleccionada";
    const filterSummary = `Filtro actual: ${modality} y ${selectedPlan}.`;

    return [
      {
        key: "collected",
        label: "Cobrado este mes",
        value: formatMoney(analytics.currentCollected),
        description: `Cuotas pagadas en ${formatPeriod(referencePeriod)}. ${filterSummary}`,
        emptyMessage: "No hay cuotas pagadas que coincidan con estos filtros.",
        items: paidItems,
        totalItems: paidItems.length,
        viewAllHref: "/admin/cuotas",
      },
      {
        key: "recurring",
        label: "Cartera mensual",
        value: formatMoney(analytics.recurringRevenue),
        description: `Valor mensual equivalente de cada cliente activo. ${filterSummary}`,
        emptyMessage: "No hay clientes activos que coincidan con estos filtros.",
        items: recurringItems,
        totalItems: recurringItems.length,
        viewAllHref: "/admin/clientes",
      },
      {
        key: "forecast",
        label: "Previsión próximo mes",
        value: formatMoney(analytics.nextMonthForecast),
        description: `Estimación basada en la cartera contratada y hasta seis meses completos de cobros. Periodo analizado: últimos ${filters.months} meses. ${filterSummary}`,
        emptyMessage: "Todavía no hay meses completos con cobros; la previsión se apoya en la cartera contratada.",
        items: historicalItems,
        totalItems: historicalItems.length,
      },
      {
        key: "pending",
        label: "Pendiente este mes",
        value: formatMoney(analytics.currentPending),
        description: `Cuotas pendientes en ${formatPeriod(referencePeriod)}. ${filterSummary}`,
        emptyMessage: "No hay cuotas pendientes que coincidan con estos filtros.",
        items: pendingItems,
        totalItems: pendingItems.length,
        viewAllHref: "/admin/cuotas",
      },
      {
        key: "average",
        label: "Ticket mensual medio",
        value: formatMoney(analytics.averageTicket),
        description: `Promedio mensual entre clientes activos con un precio asignado. ${filterSummary}`,
        emptyMessage: "No hay clientes activos con precio que coincidan con estos filtros.",
        items: averageItems,
        totalItems: averageItems.length,
        viewAllHref: "/admin/clientes",
      },
      {
        key: "active",
        label: "Clientes activos",
        value: String(analytics.activeClients),
        description: `Clientes actualmente dados de alta. ${filterSummary}`,
        emptyMessage: "No hay clientes activos que coincidan con estos filtros.",
        items: recurringItems,
        totalItems: recurringItems.length,
        viewAllHref: "/admin/clientes",
      },
    ] satisfies AnalyticsMetricDialog[];
  }, [analytics, clients, fees, filters, pricingPlans, referencePeriod]);
  const activeMetric = metricDialogs.find((metric) => metric.key === activeMetricKey) ?? null;

  useEffect(() => {
    if (activeMetricKey === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMetricKey(null);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      lastTriggerRef.current?.focus();
    };
  }, [activeMetricKey]);

  function openMetric(key: AnalyticsMetricKey, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveMetricKey(key);
  }

  return (
    <section className="mt-8" aria-labelledby="business-intelligence-heading">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 xl:flex-1">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Inteligencia del negocio</p>
          <h2 id="business-intelligence-heading" className="mt-2 text-3xl font-black">Valor de las asesorías</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Cobros reales, cartera mensual equivalente, previsión y composición de clientes. Los filtros se aplican a todas las cifras y gráficas.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 xl:w-auto xl:shrink-0 xl:grid-cols-[10.5rem_14rem_12rem]" aria-label="Filtros de estadísticas">
          <InternalSelect
            id="analytics-period"
            options={periodOptions}
            className={analyticsSelectClassName}
            ariaLabel="Periodo de las gráficas"
            value={String(filters.months)}
            onValueChange={(value) => setFilters((current) => ({ ...current, months: Number(value) as AnalyticsFilters["months"] }))}
          />
          <InternalSelect
            id="analytics-modality"
            options={modalityOptions}
            className={analyticsSelectClassName}
            value={filters.modality}
            ariaLabel="Filtrar por modalidad"
            onValueChange={(value) => setFilters((current) => ({ ...current, modality: value as AnalyticsFilters["modality"] }))}
          />
          <InternalSelect
            id="analytics-pricing-plan"
            options={[
              { value: "all", label: "Todas las tarifas" },
              ...pricingPlans.map(([id, name]) => ({ value: id, label: name })),
              { value: "unassigned", label: "Sin tarifa asignada" },
            ]}
            className={analyticsSelectClassName}
            value={filters.pricingPlanId}
            ariaLabel="Filtrar por tarifa"
            onValueChange={(value) => setFilters((current) => ({ ...current, pricingPlanId: value }))}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard metricKey="collected" icon={Banknote} label="Cobrado este mes" value={formatMoney(analytics.currentCollected)} detail="Cuotas del mes marcadas como pagadas." expanded={activeMetricKey === "collected"} onOpen={openMetric} />
        <MetricCard metricKey="recurring" icon={CircleDollarSign} label="Cartera mensual" value={formatMoney(analytics.recurringRevenue)} detail="Valor mensual equivalente de tarifas activas." expanded={activeMetricKey === "recurring"} onOpen={openMetric} />
        <MetricCard metricKey="forecast" icon={TrendingUp} label="Previsión próximo mes" value={formatMoney(analytics.nextMonthForecast)} detail="Combina tendencia reciente y cartera contratada." expanded={activeMetricKey === "forecast"} onOpen={openMetric} />
        <MetricCard metricKey="pending" icon={CalendarClock} label="Pendiente este mes" value={formatMoney(analytics.currentPending)} detail="Cuotas del mes todavía pendientes." expanded={activeMetricKey === "pending"} onOpen={openMetric} />
        <MetricCard metricKey="average" icon={Target} label="Ticket mensual medio" value={formatMoney(analytics.averageTicket)} detail="Promedio mensual por cliente con precio." expanded={activeMetricKey === "average"} onOpen={openMetric} />
        <MetricCard metricKey="active" icon={Users} label="Clientes activos" value={String(analytics.activeClients)} detail="Clientes en alta dentro de los filtros." expanded={activeMetricKey === "active"} onOpen={openMetric} />
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <div className="mb-5">
            <h3 className="text-xl font-black">Ingresos, cartera y objetivo</h3>
            <p className="text-sm text-muted">La línea de cartera prorratea cada tarifa entre los meses que cubre.</p>
          </div>
          <div className="h-80 min-w-0" role="img" aria-label="Gráfica de evolución de ingresos cobrados, cartera mensual y objetivo">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analytics.revenueSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
                <XAxis stroke="var(--muted)" dataKey="label" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" tickFormatter={compactMoney} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatMoney(Number(value))} />
                <Legend />
                <Area type="monotone" dataKey="collected" name="Cobrado" stroke="#ef2d32" fill="#fee2e2" strokeWidth={3} />
                <Line type="monotone" dataKey="recurring" name="Cartera mensual" stroke="var(--foreground)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="goal" name="Objetivo" stroke="#16a34a" strokeDasharray="6 5" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center gap-3"><Goal className="text-primary" /><div><h3 className="text-xl font-black">Objetivos</h3><p className="text-sm text-muted">Progreso del mes y de la cartera actual.</p></div></div>
          <div className="grid gap-6">
            <GoalProgress label="Ingresos cobrados" value={formatMoney(analytics.currentCollected)} target={formatMoney(goals.monthlyRevenueGoalEur)} progress={analytics.revenueGoalProgress} />
            <GoalProgress label="Clientes activos" value={String(analytics.activeClients)} target={String(goals.activeClientsGoal)} progress={analytics.clientGoalProgress} />
            <details className="rounded-[var(--radius-md)] border border-border p-4">
              <summary className="cursor-pointer font-black">Modificar objetivos</summary>
              <div className="mt-4"><DashboardGoalsForm goals={goals} /></div>
            </details>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <h3 className="text-xl font-black">Valor por tarifa</h3>
          <p className="mb-4 text-sm text-muted">Ingreso mensual equivalente de clientes activos.</p>
          <div className="h-72 min-w-0" role="img" aria-label="Gráfica del valor mensual por tarifa">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.planDistribution} layout="vertical" margin={{ left: 5, right: 15 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} />
                <XAxis stroke="var(--muted)" type="number" tickFormatter={compactMoney} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" type="category" dataKey="name" width={95} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatMoney(Number(value))} />
                <Bar dataKey="monthlyValue" name="Valor mensual" fill="#ef2d32" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-black">Modalidad de servicio</h3>
          <p className="mb-4 text-sm text-muted">Distribución de los clientes activos filtrados.</p>
          <div className="h-72 min-w-0" role="img" aria-label="Gráfica de clientes por modalidad de servicio">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.modalityDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                  {analytics.modalityDistribution.map((item, index) => <Cell key={item.key} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${Number(value)} clientes`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-black">Altas por mes</h3>
          <p className="mb-4 text-sm text-muted">Nuevos registros dentro del periodo seleccionado.</p>
          <div className="h-72 min-w-0" role="img" aria-label="Gráfica de altas de clientes por mes">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.clientGrowth}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
                <XAxis stroke="var(--muted)" dataKey="label" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${Number(value)} altas`} />
                <Bar dataKey="newClients" name="Altas" fill="var(--foreground)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Las cifras son internas y orientativas. “Cobrado” depende del registro manual de cuotas; “cartera” prorratea el precio acordado; la previsión combina esa cartera con la tendencia de hasta seis meses completos. No representa beneficio neto porque no se registran gastos.
      </p>

      {activeMetric ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveMetricKey(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            className="relative w-full max-w-2xl rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-2xl sm:p-7"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Cerrar detalle del indicador"
              onClick={() => setActiveMetricKey(null)}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">Detalle del indicador</p>
            <h2 id={dialogTitleId} className="font-display mt-2 pr-12 text-3xl font-black uppercase leading-none">
              {activeMetric.label}
            </h2>
            <p className="mt-3 text-3xl font-black">{activeMetric.value}</p>
            <p id={dialogDescriptionId} className="mt-2 text-sm leading-6 text-muted">
              {activeMetric.description}
            </p>

            {activeMetric.items.length ? (
              <ul className="mt-5 grid max-h-[min(55vh,32rem)] gap-2 overflow-y-auto pr-1">
                {activeMetric.items.slice(0, 10).map((item) => (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setActiveMetricKey(null)}
                        className="group flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border px-4 py-3 transition hover:border-primary/40 hover:bg-primary-soft/50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-foreground">{item.title}</span>
                          <span className="mt-1 block truncate text-sm text-muted">{item.detail}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2 text-sm font-bold text-muted group-hover:text-primary">
                          {item.value}
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </span>
                      </Link>
                    ) : (
                      <div className="flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border px-4 py-3">
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-foreground">{item.title}</span>
                          <span className="mt-1 block truncate text-sm text-muted">{item.detail}</span>
                        </span>
                        <span className="shrink-0 text-sm font-bold">{item.value}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-[var(--radius-md)] bg-surface-muted p-5 text-sm text-muted">{activeMetric.emptyMessage}</p>
            )}

            {activeMetric.viewAllHref && activeMetric.totalItems > 10 ? (
              <div className="mt-5 flex justify-end border-t border-border pt-5">
                <ButtonLink href={activeMetric.viewAllHref} onClick={() => setActiveMetricKey(null)}>
                  Ver más
                </ButtonLink>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </section>
  );
}
