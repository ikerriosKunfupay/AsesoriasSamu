import { CheckInForm } from "@/components/forms/client-forms";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { requireCompletedClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function ClientCheckInPage() {
  const user = await requireCompletedClient();
  const supabase = await createClient();
  const { data: history } = await supabase.from("check_ins").select("id, weight_kg, energy_level, adherence_level, notes, created_at").eq("client_id", user.id).order("created_at", { ascending: false }).limit(10);
  return <><PageHeading eyebrow="Evolución" title="Seguimiento" description="Envía una revisión breve. Tu entrenador la verá en su panel privado." /><div className="grid gap-6 xl:grid-cols-[minmax(0,560px)_1fr]"><Card><h2 className="mb-5 text-xl font-black">Nueva revisión</h2><CheckInForm /></Card><Card><h2 className="text-xl font-black">Historial</h2>{history?.length ? <div className="mt-5 grid gap-3">{history.map((item) => <div key={item.id} className="rounded-xl bg-surface-muted p-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><b>{formatDate(item.created_at)}</b><span>Energía {item.energy_level}/5 · Adherencia {item.adherence_level}/5</span></div>{item.weight_kg ? <p className="mt-2">Peso: {item.weight_kg} kg</p> : null}{item.notes ? <p className="mt-2 whitespace-pre-wrap text-muted">{item.notes}</p> : null}</div>)}</div> : <p className="mt-5 text-sm text-muted">Todavía no has enviado ninguna revisión.</p>}</Card></div></>;
}
