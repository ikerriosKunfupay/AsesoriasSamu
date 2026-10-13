"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type InternalSelectOption = {
  value: string;
  label: string;
};

export function InternalSelect({
  id,
  name,
  options,
  defaultValue = "",
  placeholder = "Selecciona",
  ariaLabel,
  required,
  invalid,
}: {
  id: string;
  name: string;
  options: readonly InternalSelectOption[];
  defaultValue?: string;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  invalid?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
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
    setValue(nextValue);
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
      <input type="hidden" name={name} value={value} />
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
        className="flex min-h-12 w-full items-center justify-between rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-left text-base text-foreground transition-colors focus:border-primary focus:outline-none"
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(event.key === "ArrowDown" ? Math.max(selectedIndex, 0) : Math.max(selectedIndex - 1, 0));
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <span className={selectedOption ? undefined : "text-muted"}>
          {selectedOption?.label ?? placeholder}
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
          className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-full overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface py-1 shadow-2xl"
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
                <span>{option.label}</span>
                {isSelected ? <Check aria-hidden="true" className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
