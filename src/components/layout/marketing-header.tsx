import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-surface-inverse/95 text-white backdrop-blur">
      <div className="page-shell flex min-h-18 items-center justify-between gap-4 py-2">
        <BrandLogo className="text-white" />
        <nav aria-label="Navegación principal" className="hidden items-center gap-6 md:flex">
          <Link href="/#asesoramiento" className="min-h-11 content-center text-sm font-bold text-zinc-300 hover:text-white">
            Asesoramiento
          </Link>
          <Link href="/#metodo" className="min-h-11 content-center text-sm font-bold text-zinc-300 hover:text-white">
            Cómo trabajamos
          </Link>
          <ButtonLink href="/login" variant="outline" className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800">
            Acceso clientes
          </ButtonLink>
          <ButtonLink href="/solicitar-informacion">Quiero información</ButtonLink>
        </nav>
        <ButtonLink href="/solicitar-informacion" size="sm" className="md:hidden">
          Información
        </ButtonLink>
      </div>
    </header>
  );
}

