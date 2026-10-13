import { BrandLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AuthShell({ title, description, children, fitViewport = false }: {
  title: string;
  description: string;
  children: React.ReactNode;
  fitViewport?: boolean;
}) {
  return (
    <main className={cn(
      "public-page grid lg:grid-cols-[0.8fr_1.2fr]",
      fitViewport ? "auth-viewport-fit h-dvh overflow-hidden" : "min-h-screen",
    )}>
      <aside className="public-dark relative hidden overflow-hidden border-r-[6px] border-primary p-12 lg:flex lg:flex-col">
        <BrandLogo className="text-white" />
        <div className="my-auto max-w-md">
          <p className="public-kicker text-white/55">Área privada</p>
          <p className="font-display mt-8 text-6xl leading-[0.88] font-black uppercase">
            Tu plan.<br /><span className="text-primary">Tu progreso.</span><br />Un solo sitio.
          </p>
        </div>
        <div className="absolute -right-24 -bottom-24 size-64 -skew-x-12 bg-primary/80" />
      </aside>
      <section className={cn(
        "auth-viewport-content flex justify-center px-5 sm:px-10 lg:grid lg:place-items-center",
        fitViewport ? "h-dvh min-h-0 overflow-hidden py-3 sm:py-4 lg:py-5" : "min-h-screen pt-6 pb-10 sm:pt-8 lg:py-10",
      )}>
        <div className={cn("w-full max-w-lg", fitViewport && "max-h-full")}>
          <div className={cn(
            "auth-viewport-header flex items-center justify-between lg:justify-start",
            fitViewport ? "mb-4 sm:mb-5 lg:mb-6" : "mb-12",
          )}>
            <BrandLogo className="lg:hidden" />
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-foreground/35 text-sm font-black uppercase hover:border-primary">
              <ArrowLeft size={16} aria-hidden="true" /> Inicio
            </Link>
          </div>
          <p className="public-kicker text-primary">Acceso Team Ortega</p>
          <h1 className={cn(
            "auth-viewport-title font-display leading-none font-black uppercase",
            fitViewport ? "mt-3 text-4xl sm:text-5xl" : "mt-6 text-5xl",
          )}>{title}</h1>
          <p className={cn(
            "auth-viewport-description max-w-md text-sm text-muted",
            fitViewport ? "mt-2 mb-4 leading-5" : "mt-4 mb-10 leading-6",
          )}>{description}</p>
          <div className={cn(
            "auth-viewport-form public-form border-t-2 border-foreground",
            fitViewport ? "pt-4" : "pt-8",
          )}>{children}</div>
        </div>
      </section>
    </main>
  );
}
