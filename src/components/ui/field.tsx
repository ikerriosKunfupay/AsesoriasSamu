import { type ReactNode } from "react";
import { FieldHelp, type FieldHelpContent } from "./field-help";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  help?: FieldHelpContent;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex min-w-0 items-center gap-1">
        <label className="min-w-0 text-sm font-bold" htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-1 text-primary" aria-hidden="true">*</span> : null}
        </label>
        {help ? <FieldHelp label={label} content={help} /> : null}
      </div>
      {children}
      {hint && !error ? <p id={`${htmlFor}-hint`} className="text-sm text-muted">{hint}</p> : null}
      {error ? <p id={`${htmlFor}-error`} className="field-error text-sm font-medium text-danger" role="alert">{error}</p> : null}
    </div>
  );
}

