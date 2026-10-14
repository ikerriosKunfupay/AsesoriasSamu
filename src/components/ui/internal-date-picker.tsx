"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const monthFormatter = new Intl.DateTimeFormat("es-ES", {
  month: "long",
  year: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const weekdays = ["L", "M", "X", "J", "V", "S", "D"];

function dateFromValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return Number.isNaN(date.getTime()) ? null : date;
}

function valueFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function InternalDatePicker({
  id,
  name,
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  ariaLabel,
  invalid,
  required,
  minValue,
  maxValue,
  className,
}: {
  id: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  ariaLabel: string;
  invalid?: boolean;
  required?: boolean;
  minValue?: string;
  maxValue?: string;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = controlledValue ?? internalValue;
  const selectedDate = dateFromValue(selectedValue);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = selectedDate ?? new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1, 12);
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const days = useMemo(() => calendarDays(visibleMonth), [visibleMonth]);
  const dialogId = `${id}-calendar`;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const openCalendar = () => {
    const initial = selectedDate ?? new Date();
    const nextMonth = new Date(initial.getFullYear(), initial.getMonth(), 1, 12);
    setVisibleMonth(nextMonth);
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      dayRefs.current[selectedValue || valueFromDate(initial)]?.focus();
    });
  };

  const commitValue = (nextValue: string) => {
    if (controlledValue === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1, 12));
  };

  return (
    <div ref={containerRef} className="relative">
      {name ? <input type="hidden" name={name} value={selectedValue} /> : null}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        data-required={required || undefined}
        data-invalid={invalid || undefined}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface py-2 pl-3.5 pr-4 text-left text-base text-foreground transition-colors focus:border-primary focus:outline-none",
          invalid ? "border-danger" : "",
          className,
        )}
        onClick={() => (isOpen ? setIsOpen(false) : openCalendar())}
      >
        <span className={selectedDate ? "" : "text-muted"}>
          {selectedDate ? shortDateFormatter.format(selectedDate) : "dd/mm/aaaa"}
        </span>
        <CalendarDays className="size-5 shrink-0 text-muted" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label={`Calendario para ${ariaLabel}`}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-[70] w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-md)] border border-border-strong bg-surface p-3 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="font-black capitalize">{monthFormatter.format(visibleMonth)}</p>
            <div className="flex gap-1">
              <button type="button" aria-label="Mes anterior" className="grid size-10 place-items-center rounded-[var(--radius-md)] hover:bg-surface-muted" onClick={() => moveMonth(-1)}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Mes siguiente" className="grid size-10 place-items-center rounded-[var(--radius-md)] hover:bg-surface-muted" onClick={() => moveMonth(1)}>
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center" aria-hidden="true">
            {weekdays.map((weekday, index) => <span key={`${weekday}-${index}`} className="py-1 text-xs font-black text-muted">{weekday}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((date) => {
              const dateValue = valueFromDate(date);
              const inCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const selected = dateValue === selectedValue;
              const today = dateValue === valueFromDate(new Date());
              const unavailable = Boolean((minValue && dateValue < minValue) || (maxValue && dateValue > maxValue));
              return (
                <button
                  key={dateValue}
                  ref={(element) => { dayRefs.current[dateValue] = element; }}
                  type="button"
                  disabled={unavailable}
                  aria-label={fullDateFormatter.format(date)}
                  aria-pressed={selected}
                  data-calendar-selected={selected || undefined}
                  className={cn(
                    "grid aspect-square min-h-9 place-items-center rounded-[var(--radius-sm)] text-sm font-bold transition hover:bg-primary-soft focus:outline-2 focus:outline-primary",
                    inCurrentMonth ? "text-foreground" : "text-muted/55",
                    unavailable ? "cursor-not-allowed opacity-30" : "",
                    today && !selected ? "border border-primary text-primary" : "",
                    selected ? "bg-primary text-white hover:bg-primary" : "",
                  )}
                  onClick={() => commitValue(dateValue)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3">
            <button type="button" className="min-h-10 rounded-[var(--radius-md)] px-3 text-sm font-bold text-primary hover:bg-primary-soft" onClick={() => commitValue("")}>Borrar</button>
            <button type="button" className="min-h-10 rounded-[var(--radius-md)] px-3 text-sm font-bold text-primary hover:bg-primary-soft" onClick={() => commitValue(valueFromDate(new Date()))}>Hoy</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
