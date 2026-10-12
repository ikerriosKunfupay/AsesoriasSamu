import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="public-dark relative grid min-h-screen place-items-center overflow-hidden px-4 text-center text-white">
      <div className="absolute inset-y-0 right-[12%] w-24 -skew-x-12 bg-primary/80" />
      <div className="relative"><p className="font-display text-[10rem] leading-none font-black text-primary">404</p><h1 className="font-display mt-3 text-4xl font-black uppercase">Esta página no existe</h1><p className="mt-4 text-white/65">Puede que el enlace haya cambiado o ya no esté disponible.</p><ButtonLink className="public-action mt-8" href="/">Volver al inicio</ButtonLink></div>
    </main>
  );
}
