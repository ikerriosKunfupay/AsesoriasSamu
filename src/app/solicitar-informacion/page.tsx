import type { Metadata } from "next";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { LeadForm } from "@/components/forms/lead-form";
import { BrandLogo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Solicitar información",
  description: "Cuéntanos tu objetivo y Team Ortega contactará contigo.",
  robots: { index: false, follow: false },
};

export default function LeadPage() {
  return (
    <main className="public-page grid min-h-screen lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="public-dark relative overflow-hidden border-b-[6px] border-primary px-5 py-8 lg:min-h-screen lg:border-r-[6px] lg:border-b-0 lg:px-12 lg:py-10">
        <div className="absolute -right-24 bottom-[-42%] size-80 -skew-x-12 bg-primary/85 lg:bottom-[-12%]" />
        <div className="relative mx-auto flex h-full max-w-lg flex-col">
          <BrandLogo className="text-white" />
          <div className="my-auto py-18 lg:py-24">
            <p className="public-kicker text-white/60">Primer contacto</p>
            <h1 className="font-display mt-7 text-5xl leading-[0.88] font-black uppercase sm:text-6xl lg:text-7xl">
              Cuéntanos<br /><span className="text-primary">qué buscas.</span>
            </h1>
            <p className="mt-7 max-w-md border-l-4 border-primary pl-5 leading-7 text-white/65">
              No te compromete a nada. Con estos datos Team Ortega podrá entender tu punto de partida y explicarte cómo puede ayudarte.
            </p>
          </div>
          <p className="hidden text-xs font-black tracking-[0.16em] text-white/35 uppercase lg:block">Tu objetivo · Tu ritmo · Tu plan</p>
        </div>
      </aside>
      <section className="px-5 py-8 sm:px-10 lg:px-16 lg:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 flex justify-end">
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-foreground/35 text-sm font-black uppercase hover:border-primary">
              <ArrowLeft size={16} aria-hidden="true" /> Volver al inicio
            </Link>
          </div>
          <p className="mb-10 max-w-xl text-lg leading-8 text-muted">
            Déjanos tus datos básicos. Solo se usarán para responderte y preparar una primera conversación útil.
          </p>
          <div className="public-form">
            <LeadForm />
          </div>
          <div className="mt-10 flex gap-3 border-t-2 border-foreground pt-6 text-xs leading-5 text-muted">
            <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>Tus datos no se publican ni se comparten con terceros. Consulta la <Link className="font-bold text-foreground hover:underline" href="/privacidad">información de privacidad</Link>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
