import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  UserPlus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const [clients, newLeads, recentLeads, questionnaires, recentQuestionnaires, checkIns, fees] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("id, full_name, goal, created_at, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("onboarding_submissions").select("id", { count: "exact", head: true }),
    supabase.from("onboarding_submissions").select("user_id, submitted_at, updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("check_ins").select("id", { count: "exact", head: true }),
    supabase.from("manual_fee_records").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const questionnaireUserIds = recentQuestionnaires.data?.map((item) => item.user_id) ?? [];
  let questionnaireProfiles: Array<{
    id: string;
    full_name: string;
    status: string;
    onboarding_complete: boolean;
  }> = [];

  if (questionnaireUserIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, status, onboarding_complete")
      .in("id", questionnaireUserIds);
    questionnaireProfiles = data ?? [];
  }

  const profilesById = new Map(questionnaireProfiles.map((profile) => [profile.id, profile]));
  const stats = [
    { label: "Clientes registrados", value: clients.count ?? 0, icon: UsersRound },
    { label: "Interesados nuevos", value: newLeads.count ?? 0, icon: UserPlus },
    { label: "Cuestionarios recibidos", value: questionnaires.count ?? 0, icon: FileText },
    { label: "Seguimientos", value: checkIns.count ?? 0, icon: ClipboardCheck },
    { label: "Cuotas pendientes", value: fees.count ?? 0, icon: WalletCards },
  ];

  return (
    <>
      <PageHeading eyebrow="Panel privado" title="Resumen" description="Vista rápida de clientes, cuestionarios, interesados y tareas de seguimiento." />
      <div className="dashboard-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><Icon size={23} /></span>
            <div><p className="text-3xl font-black">{value}</p><p className="text-sm font-bold text-muted">{label}</p></div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <div className="mb-5">
          <h2 className="text-xl font-black">Últimos cuestionarios</h2>
          <p className="mt-1 text-sm text-muted">Formularios iniciales enviados desde cuentas de cliente.</p>
        </div>
        {recentQuestionnaires.data?.length ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Cliente</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {recentQuestionnaires.data.map((questionnaire) => {
                  const profile = profilesById.get(questionnaire.user_id);
                  return (
                    <tr key={questionnaire.user_id}>
                      <td className="font-bold">{profile?.full_name || "Cliente"}</td>
                      <td>{formatDate(questionnaire.updated_at || questionnaire.submitted_at)}</td>
                      <td>
                        <Badge tone={profile?.onboarding_complete ? "success" : "warning"}>
                          {profile?.onboarding_complete ? "Completado" : "Pendiente de activar"}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <Link className="font-bold text-primary hover:underline" href={`/admin/clientes/${questionnaire.user_id}`}>
                          Ver ficha
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl bg-surface-muted p-5 text-sm text-muted">Todavía no hay cuestionarios guardados.</p>
        )}
      </Card>

      <Card className="mt-6">
        <div className="mb-5">
          <h2 className="text-xl font-black">Últimos interesados</h2>
          <p className="mt-1 text-sm text-muted">Personas que han pedido información desde la landing.</p>
        </div>
        {recentLeads.data?.length ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Nombre</th><th>Objetivo</th><th>Fecha</th><th>Estado</th></tr></thead>
              <tbody>
                {recentLeads.data.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-bold">{lead.full_name}</td>
                    <td className="max-w-sm truncate text-muted">{lead.goal}</td>
                    <td>{formatDate(lead.created_at)}</td>
                    <td><Badge tone={lead.status === "new" ? "brand" : "neutral"}>{lead.status === "new" ? "Nuevo" : lead.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl bg-surface-muted p-5 text-sm text-muted">Todavía no hay interesados.</p>
        )}
      </Card>
    </>
  );
}
