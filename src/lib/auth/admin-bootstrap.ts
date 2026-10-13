import type { UserRole } from "@/lib/supabase/database.types";

export const INITIAL_ADMIN_EMAIL = "samprox77@gmail.com";

export function needsInitialAdminPromotion(email: string | undefined, role: UserRole) {
  return email?.toLowerCase() === INITIAL_ADMIN_EMAIL && role !== "admin";
}
