import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface-inverse px-4 text-center text-white">
      <div><p className="font-display text-8xl font-black text-primary">404</p><h1 className="mt-3 text-2xl font-black">Esta página no existe</h1><p className="mt-3 text-white/65">Puede que el enlace haya cambiado o ya no esté disponible.</p><ButtonLink className="mt-7" href="/">Volver al inicio</ButtonLink></div>
    </main>
  );
}
