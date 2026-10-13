import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { requireCompletedClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; password?: string; verification?: string }>;
}) {
  const user = await requireCompletedClient();
  const query = await searchParams;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, avatar_path")
    .eq("id", user.id)
    .single();
  const { data: avatarData } = profile?.avatar_path
    ? await supabase.storage.from("profile-avatars").createSignedUrl(profile.avatar_path, 3600)
    : { data: null };

  return (
    <>
      <PageHeading
        eyebrow="Tu cuenta"
        title="Ajustes del perfil"
        description="Actualiza los datos básicos que verá tu entrenador."
      />
      <Card>
        <ProfileSettingsForm
          initial={{
            fullName: profile?.full_name || user.fullName,
            phone: profile?.phone || "",
            email: user.email,
          }}
          avatarUrl={avatarData?.signedUrl}
          notice={
            query.email === "actualizado"
              ? "Correo actualizado correctamente. Ya puedes usar la nueva dirección para iniciar sesión."
              : query.password === "actualizada"
                ? "Contraseña actualizada correctamente."
                : query.verification === "invalid"
                  ? "El enlace de verificación no es válido o ha caducado. Solicita uno nuevo."
                  : undefined
          }
          noticeTone={query.verification === "invalid" ? "error" : "success"}
        />
      </Card>
    </>
  );
}
