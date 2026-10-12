import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  compact = false,
  className,
  href = "/",
}: {
  compact?: boolean;
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center gap-2 sm:gap-2.5", className)}>
      <Image
        src="/brand/team-ortega-mark.png"
        alt=""
        width={48}
        height={48}
        className="size-10 object-contain sm:size-11"
        priority
      />
      {!compact ? (
        <span className="font-display whitespace-nowrap text-lg font-black uppercase tracking-tight sm:text-xl">
          Team <span className="text-primary">Ortega</span>
        </span>
      ) : null}
    </Link>
  );
}

