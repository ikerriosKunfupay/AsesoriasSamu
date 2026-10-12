import type { Metadata } from "next";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { LeadForm } from "@/components/forms/lead-form";
import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Solicitar información",
  description: "Cuéntanos tu objetivo y Team Ortega contactará contigo.",
  robots: { index: false, follow: false },
};

export default function LeadPage() {
  return (
    <main className="min-h-screen bg-background py-8 sm:py-14">
      <div className="page-shell max-w-3xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <BrandLogo />
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted hover:text-foreground">
            <ArrowLeft size={16} aria-hidden="true" /> Volver
          </Link>
        </div>
        <Card className="p-6 sm:p-9">
          <p className="text-sm font-black tracking-[0.14em] text-primary uppercase">Primer contacto</p>
          <h1 className="font-display mt-3 text-4xl font-black">Cuéntanos qué buscas</h1>
          <p className="mt-4 mb-8 max-w-2xl leading-7 text-muted">
            Este formulario no te compromete a nada. Déjanos unos datos básicos y Team Ortega contactará contigo para explicarte cómo puede ayudarte.
          </p>
          <LeadForm />
          <div className="mt-8 flex gap-3 border-t border-border pt-6 text-xs leading-5 text-muted">
            <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>Tus datos no se publican ni se comparten con terceros. Consulta la <Link className="font-bold text-foreground hover:underline" href="/privacidad">información de privacidad</Link>.</p>
          </div>
        </Card>
      </div>
    </main>
  );
}
