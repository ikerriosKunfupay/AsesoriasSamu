"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

export function StepsCarousel({ steps }: { steps: readonly string[] }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  function goToStep(index: number) {
    const track = trackRef.current;
    const items = track ? Array.from(track.children) as HTMLElement[] : [];
    const target = items[index];
    const first = items[0];

    if (!track || !target || !first) return;

    track.scrollTo({
      behavior: "smooth",
      left: target.offsetLeft - first.offsetLeft,
    });
    setActiveStep(index);
  }

  function syncActiveStep() {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children) as HTMLElement[];
    const firstOffset = items[0]?.offsetLeft ?? 0;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - firstOffset - track.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveStep(closestIndex);
  }

  return (
    <div className="min-w-0 max-w-full border-t border-white/30 pt-6 md:hidden">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-xs font-black tracking-[0.16em] text-white/55 uppercase">
          Desliza para ver los pasos
        </p>
        <p className="shrink-0 text-sm font-black text-white" aria-live="polite">
          0{activeStep + 1} / 0{steps.length}
        </p>
      </div>

      <ol
        ref={trackRef}
        className="flex w-full max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={syncActiveStep}
        aria-label="Pasos del proceso"
        aria-roledescription="carrusel"
        tabIndex={0}
      >
        {steps.map((step, index) => (
          <li
            key={step}
            className="min-h-64 basis-[calc(100%_-_2.75rem)] shrink-0 snap-start border border-white/25 bg-white/[0.035] p-6"
            aria-label={`Paso ${index + 1} de ${steps.length}`}
            aria-roledescription="diapositiva"
          >
            <span className="font-display text-7xl leading-none font-black text-primary">
              0{index + 1}
            </span>
            <p className="mt-6 text-xs font-black tracking-[0.16em] text-white/45 uppercase">
              Paso {index + 1}
            </p>
            <p className="mt-3 text-xl leading-8 font-bold text-white/90">{step}</p>
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-2" aria-label="Posición del carrusel">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => goToStep(index)}
              className={`h-2.5 rounded-full transition-[width,background-color] ${
                activeStep === index ? "w-8 bg-primary" : "w-2.5 bg-white/30"
              }`}
              aria-label={`Ir al paso ${index + 1}`}
              aria-current={activeStep === index ? "true" : undefined}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goToStep(activeStep - 1)}
            disabled={activeStep === 0}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Paso anterior"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goToStep(activeStep + 1)}
            disabled={activeStep === steps.length - 1}
            className="inline-flex size-11 items-center justify-center rounded-full border border-primary bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:border-white/25 disabled:bg-transparent disabled:opacity-30"
            aria-label="Paso siguiente"
          >
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
