import { type ReactNode } from "react";

export function PageHeading({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
