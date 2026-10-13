import { AssignmentsManager, type AdminAssignment } from "@/components/admin/assignments-manager";
import { PageHeading } from "@/components/layout/page-heading";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function WorkoutsPage() {
  const supabase = createAdminClient();
  const [{ data: plans }, { data: profiles }] = await Promise.all([
    supabase
      .from("workout_assignments")
      .select("id, client_id, title, status, version, starts_on, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, status").eq("role", "client").order("full_name"),
  ]);
  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name || "Cliente sin nombre"]));
  const clients = (profiles ?? [])
    .filter((profile) => profile.status !== "archived")
    .map((profile) => ({ id: profile.id, full_name: profile.full_name || "Cliente sin nombre" }));
  const assignments: AdminAssignment[] = (plans ?? []).map((plan) => ({
    id: plan.id,
    clientId: plan.client_id,
    clientName: names.get(plan.client_id) ?? "Cliente",
    title: plan.title,
    status: plan.status as AdminAssignment["status"],
    version: plan.version,
    startsOn: plan.starts_on,
    createdAt: plan.created_at,
  }));

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
      <PageHeading
        eyebrow="Asesorías"
        title="Entrenamientos"
        description="Consulta el histórico y crea nuevos entrenamientos desde esta misma sección."
      />
      <AssignmentsManager kind="workout" clients={clients} assignments={assignments} />
    </div>
  );
}
