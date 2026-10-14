import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const markReadSchema = z.object({
  ids: z.array(z.uuid()).max(50).optional(),
  all: z.boolean().optional(),
}).refine((value) => value.all === true || Boolean(value.ids?.length), {
  message: "Selecciona al menos una notificación.",
});

async function requireApiAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin" || user.status !== "active") return null;
  return user;
}

export async function GET() {
  const user = await requireApiAdmin();
  if (!user) return NextResponse.json({ message: "No autorizado." }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("id, category, title, message, href, read_at, created_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("notifications.load_failed", { code: error.code });
    return NextResponse.json({ message: "No se pudieron cargar las notificaciones." }, { status: 500 });
  }

  return NextResponse.json({ notifications: data ?? [] });
}

export async function PATCH(request: Request) {
  const user = await requireApiAdmin();
  if (!user) return NextResponse.json({ message: "No autorizado." }, { status: 401 });

  const parsed = markReadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Solicitud no válida." }, { status: 400 });

  const supabase = await createClient();
  let query = supabase
    .from("admin_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  if (!parsed.data.all) query = query.in("id", parsed.data.ids ?? []);
  const { error } = await query;

  if (error) {
    console.error("notifications.mark_read_failed", { code: error.code });
    return NextResponse.json({ message: "No se pudieron actualizar las notificaciones." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
