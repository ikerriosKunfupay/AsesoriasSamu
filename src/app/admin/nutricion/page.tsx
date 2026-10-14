import { AssignmentsManager } from "@/components/admin/assignments-manager";
import { PageHeading } from "@/components/layout/page-heading";
import { requireAdmin } from "@/lib/auth/current-user";
import type { AdminAssignment, AssignmentTemplate } from "@/lib/admin/assignments";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function NutritionPage() {
  const currentAdmin = await requireAdmin();
  const supabase = createAdminClient();
  const [{ data: plans }, { data: profiles }, { data: templates }] = await Promise.all([
    supabase
      .from("nutrition_assignments")
      .select("id, client_id, title, content, status, starts_on, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, status").eq("role", "client").order("full_name"),
    supabase.from("assignment_templates").select("id, name, title, content").eq("created_by", currentAdmin.id).eq("kind", "nutrition").order("name"),
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
    content: plan.content,
    status: plan.status as AdminAssignment["status"],
    startsOn: plan.starts_on,
    createdAt: plan.created_at,
  }));
  const assignmentTemplates = (templates ?? []) as AssignmentTemplate[];

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
      <PageHeading
        eyebrow="Asesorías"
        title="Nutrición"
        description="Consulta el histórico y crea nuevas pautas nutricionales desde esta misma sección."
      />
      <AssignmentsManager kind="nutrition" clients={clients} assignments={assignments} templates={assignmentTemplates} />
    </div>
  );
}
