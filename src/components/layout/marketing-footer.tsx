import { BrandLogo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-surface-inverse py-10 text-zinc-400">
      <div className="page-shell flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <BrandLogo className="text-white" />
        <p className="max-w-lg text-sm leading-6">
          Asesoramiento personal de entrenamiento y nutrición. La información de la plataforma no sustituye la atención médica.
        </p>
      </div>
    </footer>
  );
}

