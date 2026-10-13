import { type ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-primary" aria-hidden="true">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p id={`${htmlFor}-hint`} className="text-sm text-muted">{hint}</p> : null}
      {error ? <p id={`${htmlFor}-error`} className="text-sm font-medium text-danger" role="alert">{error}</p> : null}
    </div>
  );
}

