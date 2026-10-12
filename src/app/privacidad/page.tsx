import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = { title: "Privacidad", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return (
    <div className="public-page min-h-screen"><MarketingHeader /><main className="page-shell py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <header>
          <p className="public-kicker text-primary">Información legal</p>
          <h1 className="font-display mt-7 text-5xl leading-[0.9] font-black uppercase sm:text-6xl">Privacidad<br /><span className="text-primary">sin rodeos.</span></h1>
        </header>
        <article className="border-t-2 border-foreground">
          <p className="py-7 text-lg leading-8 text-muted">Esta página es una base operativa para el MVP. Antes de abrir el servicio al público, el responsable deberá completar sus datos identificativos y validar el texto con asesoramiento profesional.</p>
          <section className="grid gap-3 border-t border-foreground/25 py-7 sm:grid-cols-[11rem_1fr]"><h2 className="font-display text-2xl font-black uppercase">Datos tratados</h2><p className="leading-7">Datos de contacto, planificación deportiva, seguimiento y, con consentimiento explícito, información de salud necesaria para personalizar el servicio.</p></section>
          <section className="grid gap-3 border-t border-foreground/25 py-7 sm:grid-cols-[11rem_1fr]"><h2 className="font-display text-2xl font-black uppercase">Finalidad y acceso</h2><p className="leading-7">Los datos se usan para gestionar solicitudes, preparar planes y realizar el seguimiento. Solo el entrenador y cada cliente pueden acceder a la información que les corresponde.</p></section>
          <section className="grid gap-3 border-y border-foreground/25 py-7 sm:grid-cols-[11rem_1fr]"><h2 className="font-display text-2xl font-black uppercase">Conservación y derechos</h2><p className="leading-7">Los datos se conservarán mientras exista la relación profesional y durante los plazos legales aplicables. Para ejercer tus derechos, contacta con Team Ortega mediante el canal acordado.</p></section>
        </article>
      </div>
    </main><MarketingFooter /></div>
  );
}
