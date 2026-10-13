"use client";

import { useActionState, useMemo, useState } from "react";
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
  CircleDollarSign,
  Goal,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { saveDashboardGoalsAction } from "@/app/actions/admin";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  buildDashboardAnalytics,
  type AnalyticsClient,
  type AnalyticsFee,
  type AnalyticsFilters,
  type DashboardGoals,
} from "@/lib/admin/dashboard-analytics";
import { initialActionState } from "@/lib/forms/action-state";
import { formatMoney } from "@/lib/format";

const chartColors = ["#ef2d32", "#111214", "#6b7280", "#f59e0b", "#16a34a", "#2563eb"];
const selectClassName = "min-h-11 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 text-sm font-bold";

function compactMoney(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Banknote;
}) {
  return (
    <Card className="min-w-0 p-4 sm:p-5">
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
    </Card>
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

  return (
    <section className="mt-8" aria-labelledby="business-intelligence-heading">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Inteligencia del negocio</p>
          <h2 id="business-intelligence-heading" className="mt-2 text-3xl font-black">Valor de las asesorías</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Cobros reales, cartera mensual equivalente, previsión y composición de clientes. Los filtros se aplican a todas las cifras y gráficas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filtros de estadísticas">
          <select
            className={selectClassName}
            aria-label="Periodo de las gráficas"
            value={filters.months}
            onChange={(event) => setFilters((current) => ({ ...current, months: Number(event.target.value) as AnalyticsFilters["months"] }))}
          >
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </select>
          <select
            className={selectClassName}
            aria-label="Filtrar por modalidad"
            value={filters.modality}
            onChange={(event) => setFilters((current) => ({ ...current, modality: event.target.value as AnalyticsFilters["modality"] }))}
          >
            <option value="all">Todas las modalidades</option>
            <option value="in_person">Presencial</option>
            <option value="online">Virtual</option>
          </select>
          <select
            className={selectClassName}
            aria-label="Filtrar por tarifa"
            value={filters.pricingPlanId}
            onChange={(event) => setFilters((current) => ({ ...current, pricingPlanId: event.target.value }))}
          >
            <option value="all">Todas las tarifas</option>
            {pricingPlans.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            <option value="unassigned">Sin tarifa asignada</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard icon={Banknote} label="Cobrado este mes" value={formatMoney(analytics.currentCollected)} detail="Cuotas del mes marcadas como pagadas." />
        <MetricCard icon={CircleDollarSign} label="Cartera mensual" value={formatMoney(analytics.recurringRevenue)} detail="Valor mensual equivalente de tarifas activas." />
        <MetricCard icon={TrendingUp} label="Previsión próximo mes" value={formatMoney(analytics.nextMonthForecast)} detail="Combina tendencia reciente y cartera contratada." />
        <MetricCard icon={CalendarClock} label="Pendiente este mes" value={formatMoney(analytics.currentPending)} detail="Cuotas del mes todavía pendientes." />
        <MetricCard icon={Target} label="Ticket mensual medio" value={formatMoney(analytics.averageTicket)} detail="Promedio mensual por cliente con precio." />
        <MetricCard icon={Users} label="Clientes activos" value={String(analytics.activeClients)} detail="Clientes en alta dentro de los filtros." />
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
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={compactMoney} tickLine={false} axisLine={false} width={70} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Legend />
                <Area type="monotone" dataKey="collected" name="Cobrado" stroke="#ef2d32" fill="#fee2e2" strokeWidth={3} />
                <Line type="monotone" dataKey="recurring" name="Cartera mensual" stroke="#111214" strokeWidth={3} dot={false} />
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
                <CartesianGrid strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" tickFormatter={compactMoney} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={95} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
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
                <Tooltip formatter={(value) => `${Number(value)} clientes`} />
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
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                <Tooltip formatter={(value) => `${Number(value)} altas`} />
                <Bar dataKey="newClients" name="Altas" fill="#111214" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Las cifras son internas y orientativas. “Cobrado” depende del registro manual de cuotas; “cartera” prorratea el precio acordado; la previsión combina esa cartera con la tendencia de hasta seis meses completos. No representa beneficio neto porque no se registran gastos.
      </p>
    </section>
  );
}
