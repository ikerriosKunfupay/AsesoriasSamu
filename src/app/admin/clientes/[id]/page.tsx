import { notFound } from "next/navigation";
import { AssignmentForm } from "@/components/forms/admin-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/layout/page-heading";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, statusLabel } from "@/lib/format";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [profileResult, onboardingResult, workoutResult, nutritionResult, checkInsResult] = await Promise.all([
    supabase.from("profiles").select("id, full_name, phone, status, onboarding_complete, created_at").eq("id", id).eq("role", "client").single(),
    supabase.from("onboarding_submissions").select("*").eq("user_id", id).maybeSingle(),
    supabase.from("workout_assignments").select("id, title, status, starts_on, created_at").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
    supabase.from("nutrition_assignments").select("id, title, status, starts_on, created_at").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
    supabase.from("check_ins").select("id, weight_kg, energy_level, adherence_level, notes, created_at").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
  ]);
  const profile = profileResult.data;
  if (!profile) notFound();
  const onboarding = onboardingResult.data;
  return <>
    <PageHeading eyebrow="Ficha del cliente" title={profile.full_name || "Cliente"} description={`Alta: ${formatDate(profile.created_at)}`} action={<Badge tone={profile.status === "active" ? "success" : "warning"}>{statusLabel(profile.status)}</Badge>} />
    <div className="grid gap-6 xl:grid-cols-2">
      <Card><h2 className="text-xl font-black">Cuestionario inicial</h2>{onboarding ? <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-bold text-muted">Edad</dt><dd>{onboarding.age} años</dd></div><div><dt className="font-bold text-muted">Peso / altura</dt><dd>{onboarding.weight_kg} kg · {onboarding.height_cm} cm</dd></div><div className="sm:col-span-2"><dt className="font-bold text-muted">Objetivos</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.goals}</dd></div><div className="sm:col-span-2"><dt className="font-bold text-muted">Rutina y horarios</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.occupation_schedule}</dd></div><div><dt className="font-bold text-muted">Lesiones o condiciones</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.conditions_injuries || "No indicadas"}</dd></div><div><dt className="font-bold text-muted">Alergias o intolerancias</dt><dd className="mt-1 whitespace-pre-wrap">{onboarding.allergies_intolerances || "No indicadas"}</dd></div></dl> : <p className="mt-4 rounded-xl bg-warning-soft p-4 text-sm text-warning">El cliente todavía no ha completado el cuestionario.</p>}</Card>
      <Card><h2 className="text-xl font-black">Últimos seguimientos</h2>{checkInsResult.data?.length ? <div className="mt-5 grid gap-3">{checkInsResult.data.map((item) => <div key={item.id} className="rounded-xl bg-surface-muted p-4 text-sm"><div className="flex justify-between gap-4"><b>{formatDate(item.created_at)}</b><span>Energía {item.energy_level}/5 · Adherencia {item.adherence_level}/5</span></div>{item.notes ? <p className="mt-2 text-muted">{item.notes}</p> : null}</div>)}</div> : <p className="mt-4 text-sm text-muted">Aún no hay seguimientos.</p>}</Card>
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><Card><h2 className="mb-5 text-xl font-black">Nuevo entrenamiento</h2><AssignmentForm clientId={id} kind="workout" />{workoutResult.data?.length ? <ul className="mt-6 border-t border-border pt-5">{workoutResult.data.map((plan) => <li key={plan.id} className="flex justify-between gap-3 py-2 text-sm"><span className="font-bold">{plan.title}</span><Badge tone={plan.status === "published" ? "success" : "neutral"}>{statusLabel(plan.status)}</Badge></li>)}</ul> : null}</Card><Card><h2 className="mb-5 text-xl font-black">Nueva pauta nutricional</h2><AssignmentForm clientId={id} kind="nutrition" />{nutritionResult.data?.length ? <ul className="mt-6 border-t border-border pt-5">{nutritionResult.data.map((plan) => <li key={plan.id} className="flex justify-between gap-3 py-2 text-sm"><span className="font-bold">{plan.title}</span><Badge tone={plan.status === "published" ? "success" : "neutral"}>{statusLabel(plan.status)}</Badge></li>)}</ul> : null}</Card></div>
  </>;
}
