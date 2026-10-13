import Image from "next/image";
import {
  ArrowRight,
  Dumbbell,
  Salad,
  TrendingUp,
} from "lucide-react";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { ButtonLink } from "@/components/ui/button";

const benefits = [
  {
    icon: Dumbbell,
    title: "Entrenamiento a tu medida",
    description:
      "Una planificación adaptada a tu nivel, tu disponibilidad y el material que tienes.",
  },
  {
    icon: Salad,
    title: "Nutrición que encaja contigo",
    description:
      "Pautas claras y realistas pensadas para tus horarios, preferencias y objetivos.",
  },
  {
    icon: TrendingUp,
    title: "Progreso visible",
    description:
      "Revisiones periódicas para ver tu evolución y ajustar el plan cuando lo necesites.",
  },
];

const steps = [
  "Cuéntanos tu situación, disponibilidad y objetivos.",
  "Recibe tu planificación personal de entrenamiento y nutrición.",
  "Registra tus avances y mantén el contacto durante todo el proceso.",
];

export default function Home() {
  return (
    <div className="public-page flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="public-dark relative overflow-hidden border-b-[6px] border-primary">
          <div className="absolute -right-24 top-0 h-full w-[42%] -skew-x-12 bg-white/[0.025]" />
          <div className="absolute right-[9%] top-0 h-40 w-6 -skew-x-12 bg-primary" />
          <div className="page-shell relative grid min-h-[500px] items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-12">
            <div className="max-w-3xl">
              <p className="public-kicker mb-6 text-white/65">
                Entrenamiento online personalizado
              </p>
              <h1 className="font-display text-[clamp(2.8rem,5vw,4.6rem)] leading-[0.86] font-black tracking-[-0.055em] uppercase">
                Tu objetivo
                <span className="mt-3 block text-primary">exige un plan</span>
                <span className="mt-3 block">de verdad.</span>
              </h1>
              <p className="mt-7 max-w-xl border-l-4 border-primary pl-5 text-base leading-7 text-white/70 sm:text-lg">
                Entrenamiento, nutrición y seguimiento en un mismo sitio. Sin
                plantillas genéricas y con un plan que evoluciona contigo.
              </p>
              <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <ButtonLink href="/solicitar-informacion" size="lg" className="public-action">
                  Quiero más información <ArrowRight aria-hidden="true" size={18} />
                </ButtonLink>
                <ButtonLink href="/login" variant="ghost" size="lg" className="rounded-none border-b-2 border-white/45 bg-transparent px-0 text-white hover:border-primary hover:bg-transparent">
                  Acceso clientes
                </ButtonLink>
              </div>
            </div>
            <div className="hero-mark relative mx-auto hidden w-full max-w-[20rem] lg:block">
              <Image
                src="/brand/team-ortega-mark.png"
                alt="Team Ortega"
                width={400}
                height={400}
                className="relative h-auto w-full drop-shadow-[0_34px_32px_rgba(0,0,0,0.52)]"
                priority
              />
              <p className="absolute -bottom-4 right-0 text-xs font-black tracking-[0.24em] text-white uppercase">Disciplina · Progreso · Equipo</p>
            </div>
          </div>
        </section>

        <section id="asesoramiento" className="scroll-mt-20 py-22 sm:py-30">
          <div className="page-shell">
            <div className="grid gap-8 border-b-2 border-foreground pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <p className="public-kicker text-primary">
              Un acompañamiento completo
              </p>
              <div>
                <h2 className="font-display text-5xl leading-[0.93] font-black tracking-tight uppercase sm:text-6xl">
                  Menos improvisar.<br /><span className="text-primary">Más avanzar.</span>
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  Toda tu planificación y tu evolución quedan ordenadas en un único
                  espacio, con instrucciones claras y acceso directo a tu entrenador.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <article key={title} className="border-b border-foreground/25 py-9 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-black text-foreground/15">0{index + 1}</span>
                    <Icon className="text-primary" aria-hidden="true" size={29} strokeWidth={2.4} />
                  </div>
                  <h3 className="font-display mt-8 text-2xl font-black uppercase">{title}</h3>
                  <p className="mt-4 max-w-sm leading-7 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="public-dark scroll-mt-20 border-y border-white/10 py-22 sm:py-30">
          <div className="page-shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="public-kicker text-primary">Cómo funciona</p>
              <h2 className="font-display mt-7 text-5xl leading-[0.9] font-black uppercase sm:text-6xl">
                Claro desde<br />el primer día.
              </h2>
              <p className="mt-6 max-w-sm leading-7 text-white/58">
                Nada de hojas dispersas ni documentos difíciles de seguir. Tu plan,
                tus revisiones y tu progreso siempre a mano.
              </p>
            </div>
            <ol className="border-t border-white/30">
              {steps.map((step, index) => (
                <li key={step} className="grid gap-5 border-b border-white/20 py-8 sm:grid-cols-[9rem_1fr] sm:items-center sm:py-10">
                  <span className="font-display text-7xl leading-none font-black text-primary">0{index + 1}</span>
                  <div>
                    <p className="text-xs font-black tracking-[0.16em] text-white/45 uppercase">Paso {index + 1}</p>
                    <p className="mt-3 max-w-xl text-xl leading-8 font-bold text-white/90">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden bg-primary text-white">
          <div className="absolute inset-y-0 right-[-8%] w-[38%] -skew-x-12 bg-black/12" />
          <div className="page-shell relative grid gap-9 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:py-20">
            <div>
              <p className="public-kicker text-white/70">Empieza por hablar</p>
              <h2 className="font-display mt-5 max-w-4xl text-4xl leading-[0.95] font-black uppercase sm:text-6xl">
                Cuéntanos tu objetivo. El plan viene después.
              </h2>
            </div>
            <ButtonLink href="/solicitar-informacion" size="lg" variant="secondary" className="public-action justify-self-start bg-surface-inverse hover:bg-black lg:justify-self-end">
              Solicitar información <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
