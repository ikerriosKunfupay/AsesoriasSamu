import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = { title: "Privacidad", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return (
    <><MarketingHeader /><main className="page-shell max-w-3xl py-16"><article className="prose prose-zinc max-w-none">
      <h1 className="font-display text-4xl font-black">Información de privacidad</h1>
      <p className="mt-5 leading-7 text-muted">Esta página es una base operativa para el MVP. Antes de abrir el servicio al público, el responsable deberá completar sus datos identificativos y validar el texto con asesoramiento profesional.</p>
      <h2 className="mt-10 text-2xl font-black">Datos tratados</h2><p className="mt-3 leading-7">Datos de contacto, planificación deportiva, seguimiento y, con consentimiento explícito, información de salud necesaria para personalizar el servicio.</p>
      <h2 className="mt-8 text-2xl font-black">Finalidad y acceso</h2><p className="mt-3 leading-7">Los datos se usan para gestionar solicitudes, preparar planes y realizar el seguimiento. Solo el entrenador y cada cliente pueden acceder a la información que les corresponde.</p>
      <h2 className="mt-8 text-2xl font-black">Conservación y derechos</h2><p className="mt-3 leading-7">Los datos se conservarán mientras exista la relación profesional y durante los plazos legales aplicables. Para ejercer tus derechos, contacta con Team Ortega mediante el canal acordado.</p>
    </article></main><MarketingFooter /></>
  );
}
