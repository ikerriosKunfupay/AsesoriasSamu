import { BrandLogo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t-[6px] border-primary bg-surface-inverse py-12 text-zinc-400">
      <div className="page-shell grid gap-8 border-b border-white/15 pb-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          <p className="mb-5 text-xs font-black tracking-[0.16em] text-primary uppercase">Entrena con intención</p>
          <BrandLogo className="text-white" />
        </div>
        <p className="max-w-xl text-sm leading-6 md:justify-self-end md:text-right">
          Asesoramiento personal de entrenamiento y nutrición. La información de la plataforma no sustituye la atención médica.
        </p>
      </div>
      <div className="page-shell pt-5 text-xs font-bold tracking-[0.1em] text-zinc-600 uppercase">Team Ortega · Entrenamiento online</div>
    </footer>
  );
}

