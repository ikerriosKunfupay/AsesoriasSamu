import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  AssignmentForm,
  ClientAdminNotesForm,
  ClientStatusSwitch,
} from "@/components/forms/admin-forms";
import { ClientCommercialTermsForm } from "@/components/forms/commercial-terms-forms";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { PageHeading } from "@/components/layout/page-heading";
import { getClientReturnDestination } from "@/lib/admin/client-navigation";
import type { PricingPlanOption } from "@/lib/admin/commercial-terms";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, statusLabel } from "@/lib/format";
import {
  getSocialPlatformLabel,
  getSocialProfileUrl,
  parseSocialProfiles,
} from "@/lib/forms/social-networks";
import { formatStoredPhoneValue } from "@/lib/forms/phone";

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const [{ id }, { returnTo }] = await Promise.all([params, searchParams]);
  const returnDestination = getClientReturnDestination(returnTo);
  const supabase = createAdminClient();
  const [profileResult, authResult, onboardingResult, workoutResult, nutritionResult, checkInsResult, adminNotesResult, commercialResult, pricingResult] = await Promise.all([
    supabase.from("profiles").select("id, full_name, phone, avatar_path, status, onboarding_complete, created_at").eq("id", id).eq("role", "client").single(),
    supabase.auth.admin.getUserById(id),
    supabase.from("onboarding_submissions").select("*").eq("user_id", id).maybeSingle(),
    supabase.from("workout_assignments").select("id, title, status, starts_on, created_at").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
    supabase.from("nutrition_assignments").select("id, title, status, starts_on, created_at").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
    supabase.from("check_ins").select("id, weight_kg, energy_level, adherence_level, notes, created_at").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
    supabase.from("client_admin_notes").select("notes").eq("client_id", id).maybeSingle(),
    supabase.from("client_commercial_terms").select("modality, pricing_plan_id, agreed_amount_eur").eq("client_id", id).maybeSingle(),
    supabase.from("pricing_plans").select("id, name, billing_cycle, duration_months, service_modality, days_per_week, default_amount_eur, active").order("name"),
  ]);
  const profile = profileResult.data;
  if (!profile) notFound();
  const clientName = profile.full_name || "Cliente";
  const onboarding = onboardingResult.data;
  const socialProfiles = parseSocialProfiles(onboarding?.social_networks);
  const { data: avatarData } = profile.avatar_path
    ? await supabase.storage.from("profile-avatars").createSignedUrl(profile.avatar_path, 3600)
    : { data: null };
  const email = authResult.data.user?.email;
  const displayPhone = profile.phone ? formatStoredPhoneValue(profile.phone) : "";
  const pricingPlans: PricingPlanOption[] = (pricingResult.data ?? []).map((plan) => ({
    id: plan.id,
    name: plan.name,
    billingCycle: plan.billing_cycle,
    durationMonths: plan.duration_months,
    serviceModality: plan.service_modality,
    daysPerWeek: plan.days_per_week,
    defaultAmountEur: plan.default_amount_eur,
    active: plan.active,
  }));
  const commercialTerms = commercialResult.data ? {
    modality: commercialResult.data.modality,
    pricingPlanId: commercialResult.data.pricing_plan_id,
    agreedAmountEur: commercialResult.data.agreed_amount_eur,
  } : null;
  return <>
    <ButtonLink href={returnDestination.href} variant="outline" size="sm" className="mb-5">
      <ArrowLeft className="size-4" aria-hidden="true" />
      {returnDestination.label}
    </ButtonLink>
    <PageHeading
      eyebrow="Ficha del cliente"
      title={clientName}
      description={`Alta: ${formatDate(profile.created_at)}`}
      action={<ClientStatusSwitch clientId={id} clientName={clientName} status={profile.status} />}
    />
    <Card className="mb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProfileAvatar name={profile.full_name || "Cliente"} src={avatarData?.signedUrl} className="size-24 text-2xl" />
        <dl className="grid min-w-0 flex-1 gap-4 text-sm sm:grid-cols-2">
          <div><dt className="font-bold text-muted">Nombre</dt><dd className="mt-1 font-bold">{profile.full_name || "Sin indicar"}</dd></div>
          <div><dt className="font-bold text-muted">Teléfono</dt><dd className="mt-1">{displayPhone ? <a className="hover:text-primary hover:underline" href={`tel:${displayPhone.replace(/\s+/g, "")}`}>{displayPhone}</a> : "Sin indicar"}</dd></div>
          <div className="sm:col-span-2"><dt className="font-bold text-muted">Correo electrónico</dt><dd className="mt-1 break-all">{email ? <a className="hover:text-primary hover:underline" href={`mailto:${email}`}>{email}</a> : "No disponible"}</dd></div>
        </dl>
      </div>
    </Card>
    <Card className="mb-6">
      <h2 className="text-xl font-black">Condiciones comerciales</h2>
      <p className="mb-5 mt-1 text-sm text-muted">
        Asigna modalidad, tarifa y precio acordado. Es información interna y no procesa cobros.
      </p>
      <ClientCommercialTermsForm clientId={id} pricingPlans={pricingPlans} initialTerms={commercialTerms} />
    </Card>
    <Card className="mb-6">
      <h2 className="mb-4 text-xl font-black">Notas internas</h2>
      <ClientAdminNotesForm clientId={id} initialNotes={adminNotesResult.data?.notes ?? ""} />
    </Card>
    <div className="grid gap-6 xl:grid-cols-2">
      <Card id="cuestionario" className="scroll-mt-24 target:ring-2 target:ring-primary"><h2 className="text-xl font-black">Cuestionario inicial</h2>{onboarding ? <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-bold text-muted">Edad</dt><dd>{onboarding.age} años</dd></div><div><dt className="font-bold text-muted">Peso / altura</dt><dd>{onboarding.weight_kg} kg · {onboarding.height_cm} cm</dd></div><div className="sm:col-span-2"><dt className="font-bold text-muted">Objetivos</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.goals}</dd></div><div className="sm:col-span-2"><dt className="font-bold text-muted">Rutina y horarios</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.occupation_schedule}</dd></div><div><dt className="font-bold text-muted">Lesiones o condiciones</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.conditions_injuries || "No indicadas"}</dd></div><div><dt className="font-bold text-muted">Alergias o intolerancias</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.allergies_intolerances || "No indicadas"}</dd></div><div className="sm:col-span-2"><dt className="font-bold text-muted">Redes sociales</dt><dd className="mt-2 flex flex-wrap gap-2">{socialProfiles.length > 0 ? socialProfiles.map((socialProfile, index) => <a key={`${socialProfile.platform}-${socialProfile.username}-${index}`} href={getSocialProfileUrl(socialProfile)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 font-bold transition-colors hover:border-primary hover:text-primary">{getSocialPlatformLabel(socialProfile.platform)} · @{socialProfile.username}<ExternalLink aria-hidden="true" className="size-4" /></a>) : <span className="text-muted">No indicadas</span>}</dd></div></dl> : <p className="mt-4 rounded-xl bg-warning-soft p-4 text-sm text-warning">El cliente todavía no ha completado el cuestionario.</p>}</Card>
      <Card><h2 className="text-xl font-black">Últimos seguimientos</h2>{checkInsResult.data?.length ? <div className="mt-5 grid gap-3">{checkInsResult.data.map((item) => <div key={item.id} className="rounded-xl bg-surface-muted p-4 text-sm"><div className="flex justify-between gap-4"><b>{formatDate(item.created_at)}</b><span>Energía {item.energy_level}/5 · Adherencia {item.adherence_level}/5</span></div>{item.notes ? <p className="mt-2 text-muted">{item.notes}</p> : null}</div>)}</div> : <p className="mt-4 text-sm text-muted">Aún no hay seguimientos.</p>}</Card>
    </div>
    <Card className="mt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Entrenamientos recientes</h2>
          <p className="mt-1 text-sm text-muted">La creación y edición del bloque completo se gestiona desde Entrenamientos.</p>
        </div>
        <ButtonLink href="/admin/entrenamientos" variant="outline" size="sm">Abrir Entrenamientos</ButtonLink>
      </div>
      {workoutResult.data?.length ? <ul className="mt-5 border-t border-border pt-3">{workoutResult.data.map((plan) => <li key={plan.id} className="flex justify-between gap-3 py-2 text-sm"><span className="font-bold">{plan.title}</span><Badge tone={plan.status === "published" ? "success" : "neutral"}>{statusLabel(plan.status)}</Badge></li>)}</ul> : <p className="mt-5 border-t border-border pt-4 text-sm text-muted">Todavía no hay entrenamientos asignados.</p>}
    </Card>
    <Card className="mt-6">
      <h2 className="mb-5 text-xl font-black">Nueva pauta nutricional</h2>
      <AssignmentForm clientId={id} kind="nutrition" />
      {nutritionResult.data?.length ? <ul className="mt-6 border-t border-border pt-5">{nutritionResult.data.map((plan) => <li key={plan.id} className="flex justify-between gap-3 py-2 text-sm"><span className="font-bold">{plan.title}</span><Badge tone={plan.status === "published" ? "success" : "neutral"}>{statusLabel(plan.status)}</Badge></li>)}</ul> : null}
    </Card>
  </>;
}
