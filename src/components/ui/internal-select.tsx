"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InternalSelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

export function InternalSelect({
  id,
  name,
  options,
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  placeholder = "Selecciona",
  ariaLabel,
  required,
  invalid,
  className,
  menuPlacement = "bottom",
  disabled,
}: {
  id: string;
  name?: string;
  options: readonly InternalSelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  invalid?: boolean;
  className?: string;
  menuPlacement?: "top" | "bottom";
  disabled?: boolean;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const value = controlledValue ?? internalValue;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = options[selectedIndex];
  const listboxId = `${id}-options`;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  const openMenu = (focusIndex = Math.max(selectedIndex, 0)) => {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[focusIndex]?.focus());
  };

  const selectOption = (nextValue: string) => {
    if (controlledValue === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      optionRefs.current[(index + direction + options.length) % options.length]?.focus();
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionRefs.current[event.key === "Home" ? 0 : options.length - 1]?.focus();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
    if (event.key === "Tab") setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-autocomplete="none"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        disabled={disabled}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface py-2 pl-3.5 pr-4 text-left text-base text-foreground transition-colors focus:border-primary focus:outline-none disabled:pointer-events-none disabled:opacity-60",
          className,
        )}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(event.key === "ArrowDown" ? Math.max(selectedIndex, 0) : Math.max(selectedIndex - 1, 0));
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <span className={`flex min-w-0 items-center gap-2 ${selectedOption ? "" : "text-muted"}`}>
          {selectedOption?.icon ? <span className="shrink-0" aria-hidden="true">{selectedOption.icon}</span> : null}
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted"}`}
        />
      </button>
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`Opciones de ${ariaLabel}`}
          className={cn(
            "absolute left-0 z-40 w-full overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface py-1 shadow-2xl",
            menuPlacement === "top" ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex min-h-11 w-full items-center justify-between px-4 text-left text-sm font-bold transition-colors hover:bg-surface-muted focus:bg-surface-muted focus:outline-none ${isSelected ? "text-primary" : "text-foreground"}`}
                onClick={() => selectOption(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {option.icon ? <span className="shrink-0" aria-hidden="true">{option.icon}</span> : null}
                  <span className="truncate">{option.label}</span>
                </span>
                {isSelected ? <Check aria-hidden="true" className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
