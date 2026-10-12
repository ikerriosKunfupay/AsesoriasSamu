import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-base text-foreground placeholder:text-muted/70 disabled:bg-surface-muted",
        className,
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-3 text-base text-foreground placeholder:text-muted/70 disabled:bg-surface-muted",
          className,
        )}
        {...props}
      />
    );
  },
);

