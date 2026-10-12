import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface px-6 py-10 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h2 className="text-lg font-black">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
