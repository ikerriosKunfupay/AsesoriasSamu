import { CalendarDays, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";

export function PlanView({ plan, emptyTitle, emptyDescription, icon }: {
  plan: { title: string; content: string; starts_on: string | null; updated_at: string } | null;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
}) {
  if (!plan) return <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />;
  return <Card className="max-w-4xl"><div className="flex flex-col justify-between gap-3 border-b border-border pb-5 sm:flex-row sm:items-center"><h2 className="text-2xl font-black">{plan.title}</h2><p className="flex items-center gap-2 text-sm text-muted"><CalendarDays size={16} /> Desde {formatDate(plan.starts_on ?? plan.updated_at)}</p></div><div className="mt-6 whitespace-pre-wrap text-[15px] leading-7">{plan.content}</div><p className="mt-8 border-t border-border pt-5 text-xs leading-5 text-muted">Si un ejercicio, alimento o indicación no te sienta bien, detente y consulta con tu entrenador. Esta planificación no sustituye atención sanitaria.</p></Card>;
}
