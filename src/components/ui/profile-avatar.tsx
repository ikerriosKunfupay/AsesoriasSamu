import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "TO";
}

export function ProfileAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={src ? `Foto de perfil de ${name}` : `Iniciales de ${name}`}
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-full border-2 border-primary bg-surface-muted bg-cover bg-center text-sm font-black text-primary",
        className,
      )}
      style={src ? { backgroundImage: `url(${JSON.stringify(src).slice(1, -1)})` } : undefined}
    >
      {src ? null : initials(name)}
    </span>
  );
}
