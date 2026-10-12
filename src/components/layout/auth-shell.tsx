import { BrandLogo } from "@/components/brand/logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AuthShell({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="public-page grid min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
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
      <section className="grid min-h-screen place-items-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-lg">
          <div className="mb-12 flex items-center justify-between lg:justify-end">
            <BrandLogo className="lg:hidden" />
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-foreground/35 text-sm font-black uppercase hover:border-primary">
              <ArrowLeft size={16} aria-hidden="true" /> Inicio
            </Link>
          </div>
          <p className="public-kicker text-primary">Acceso Team Ortega</p>
          <h1 className="font-display mt-6 text-5xl leading-none font-black uppercase">{title}</h1>
          <p className="mt-4 mb-10 max-w-md text-sm leading-6 text-muted">{description}</p>
          <div className="public-form border-t-2 border-foreground pt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
