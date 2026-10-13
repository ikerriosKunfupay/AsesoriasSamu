import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAdmin } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Administración", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const supabase = user.avatarPath ? await createClient() : null;
  const { data: avatarData } = user.avatarPath && supabase
    ? await supabase.storage.from("profile-avatars").createSignedUrl(user.avatarPath, 3600)
    : { data: null };

  return (
    <DashboardShell mode="admin" userName={user.fullName} userAvatarUrl={avatarData?.signedUrl}>
      {children}
    </DashboardShell>
  );
}
