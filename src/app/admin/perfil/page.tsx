import { BadgeCheck } from "lucide-react";
import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { PageHeading } from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProfilePage() {
  const user = await requireAdmin();
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
    <div className="mx-auto w-full max-w-4xl">
      <PageHeading
        eyebrow="Tu cuenta"
        title="Perfil de administrador"
        description="Personaliza el nombre, el teléfono y la foto que aparecen en el panel."
        action={(
          <Badge tone="brand" className="gap-1.5 self-start sm:self-auto">
            <BadgeCheck className="size-4" aria-hidden="true" /> Cuenta verificada
          </Badge>
        )}
      />
      <Card>
        <ProfileSettingsForm
          variant="admin"
          initial={{
            fullName: profile?.full_name || user.fullName,
            phone: profile?.phone || "",
            email: user.email,
          }}
          avatarUrl={avatarData?.signedUrl}
        />
      </Card>
    </div>
  );
}
