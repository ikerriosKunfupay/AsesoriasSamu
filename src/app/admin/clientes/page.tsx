import { UserPlus } from "lucide-react";
import { ClientsTable } from "@/components/admin/clients-table";
import { PageHeading } from "@/components/layout/page-heading";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, phone, status, onboarding_complete, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });
  const clientIds = clients?.map((client) => client.id) ?? [];
  const { data: noteRows } = clientIds.length
    ? await supabase.from("client_admin_notes").select("client_id, notes").in("client_id", clientIds)
    : { data: [] };
  const notesByClientId = new Map(noteRows?.map((row) => [row.client_id, row.notes]));

  return (
    <>
      <PageHeading
        eyebrow="Gestión"
        title="Clientes"
        description="Invita clientes, gestiona su alta o baja y consulta su planificación."
        action={(
          <ButtonLink href="/admin/clientes/nuevo">
            <UserPlus size={17} /> Invitar cliente
          </ButtonLink>
        )}
      />
      {clients?.length ? (
        <ClientsTable clients={clients.map((client) => ({
          id: client.id,
          name: client.full_name || "Sin nombre",
          status: client.status,
          onboardingComplete: client.onboarding_complete,
          notes: notesByClientId.get(client.id) ?? "",
        }))} />
      ) : (
        <EmptyState
          icon={UserPlus}
          title="Aún no hay clientes"
          description="Invita al primer cliente para que cree su contraseña y complete el cuestionario inicial."
          action={<ButtonLink href="/admin/clientes/nuevo">Invitar cliente</ButtonLink>}
        />
      )}
    </>
  );
}
