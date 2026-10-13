import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Área personal", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await requireClient();
  const supabase = user.avatarPath ? await createClient() : null;
  const { data: avatarData } = user.avatarPath && supabase
    ? await supabase.storage.from("profile-avatars").createSignedUrl(user.avatarPath, 3600)
    : { data: null };

  return (
    <DashboardShell
      mode="client"
      userName={user.fullName}
      userAvatarUrl={avatarData?.signedUrl}
      onboardingComplete={user.onboardingComplete}
    >
      {children}
    </DashboardShell>
  );
}
