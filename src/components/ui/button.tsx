import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
  secondary: "bg-surface-inverse text-white hover:bg-zinc-800",
  outline: "border border-border-strong bg-surface text-foreground hover:bg-surface-muted",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-white hover:opacity-90",
} as const;

const sizes = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
} as const;

type StyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function buttonStyles({ variant = "primary", size = "md", className }: StyleProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-bold transition-colors disabled:pointer-events-none disabled:opacity-55",
    variants[variant],
    sizes[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & StyleProps>(
  function Button({
    variant = "primary",
    size = "md",
    className,
    type = "button",
    ...props
  }, ref) {
    return <button ref={ref} type={type} className={buttonStyles({ variant, size, className })} {...props} />;
  },
);

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

