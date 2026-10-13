import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/15 bg-surface-inverse/95 text-white backdrop-blur">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4 py-2">
        <BrandLogo className="text-white" />
        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          <Link href="/#asesoramiento" className="min-h-11 content-center border-b-2 border-transparent text-xs font-black tracking-[0.12em] text-zinc-300 uppercase hover:border-primary hover:text-white">
            Asesoramiento
          </Link>
          <Link href="/#metodo" className="min-h-11 content-center border-b-2 border-transparent text-xs font-black tracking-[0.12em] text-zinc-300 uppercase hover:border-primary hover:text-white">
            Cómo trabajamos
          </Link>
          <ButtonLink href="/solicitar-informacion" variant="ghost" className="rounded-none border-b-2 border-white/40 bg-transparent px-0 text-white hover:border-primary hover:bg-transparent">
            Quiero información
          </ButtonLink>
          <ButtonLink href="/login" className="public-action">Acceder</ButtonLink>
        </nav>
        <ButtonLink href="/login" size="sm" className="public-action md:hidden">
          Acceder
        </ButtonLink>
      </div>
    </header>
  );
}

