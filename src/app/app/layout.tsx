import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireClient } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Área personal", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await requireClient();
  return <DashboardShell mode="client" userName={user.fullName} onboardingComplete={user.onboardingComplete}>{children}</DashboardShell>;
}
