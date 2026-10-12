import Image from "next/image";
import {
  ArrowRight,
  Check,
  Dumbbell,
  MessageCircle,
  Salad,
  TrendingUp,
} from "lucide-react";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex-1">
        <section className="brand-grid relative overflow-hidden bg-surface-inverse text-white">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(229,45,45,0.22),transparent_68%)]" />
          <div className="page-shell relative grid min-h-[650px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold tracking-[0.12em] text-white/80 uppercase">
                Entrenamiento online personalizado
              </p>
              <h1 className="font-display text-5xl leading-[0.96] font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Tu objetivo.
                <br />
                <span className="text-primary">Un plan de verdad.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/72 sm:text-xl">
                Entrenamiento, nutrición y seguimiento en un mismo sitio. Sin
                plantillas genéricas y con un plan que evoluciona contigo.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/solicitar-informacion" size="lg">
                  Quiero más información <ArrowRight aria-hidden="true" size={18} />
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary" size="lg">
                  Acceso clientes
                </ButtonLink>
              </div>
              <ul className="mt-8 flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:gap-6">
                {[
                  "Atención personalizada",
                  "Seguimiento sencillo",
                  "Todo desde cualquier dispositivo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="text-primary" aria-hidden="true" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto hidden w-full max-w-md lg:block">
              <div className="absolute inset-10 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-10 shadow-2xl backdrop-blur-sm">
                <Image
                  src="/brand/team-ortega-mark.png"
                  alt="Team Ortega"
                  width={430}
                  height={430}
                  className="h-auto w-full drop-shadow-[0_28px_30px_rgba(0,0,0,0.45)]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="asesoramiento" className="page-shell py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-black tracking-[0.15em] text-primary uppercase">
              Un acompañamiento completo
            </p>
            <h2 className="font-display mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Menos improvisar. Más avanzar.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Toda tu planificación y tu evolución quedan ordenadas en un único
              espacio, con instrucciones claras y acceso directo a tu entrenador.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-7">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon aria-hidden="true" size={24} />
                </span>
                <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="metodo" className="scroll-mt-20 bg-surface-muted py-20 sm:py-28">
          <div className="page-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black tracking-[0.15em] text-primary uppercase">
                Cómo funciona
              </p>
              <h2 className="font-display mt-3 text-4xl font-black sm:text-5xl">
                Un proceso simple desde el primer día.
              </h2>
              <p className="mt-5 leading-7 text-muted">
                Nada de hojas dispersas ni documentos difíciles de seguir. Tu plan,
                tus revisiones y tu progreso siempre a mano.
              </p>
            </div>
            <ol className="grid gap-4">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <span className="font-display flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-inverse text-lg font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-extrabold">Paso {index + 1}</p>
                    <p className="mt-1 leading-7 text-muted">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-shell py-20 sm:py-28">
          <div className="brand-grid overflow-hidden rounded-[2rem] bg-surface-inverse px-6 py-14 text-center text-white shadow-xl sm:px-12">
            <MessageCircle className="mx-auto text-primary" aria-hidden="true" size={36} />
            <h2 className="font-display mx-auto mt-5 max-w-2xl text-4xl font-black sm:text-5xl">
              ¿Quieres saber si este acompañamiento es para ti?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/70">
              Déjanos tus datos y tu objetivo. Team Ortega contactará contigo para
              explicarte el proceso sin compromiso.
            </p>
            <ButtonLink href="/solicitar-informacion" size="lg" className="mt-8">
              Solicitar información <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
