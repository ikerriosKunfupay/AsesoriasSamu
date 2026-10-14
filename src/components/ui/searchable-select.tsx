"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = {
  value: string;
  label: string;
  keywords?: string;
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-ES")
    .replace(/\s+/g, " ")
    .trim();
}

export function SearchableSelect({
  id,
  options,
  value,
  onValueChange,
  ariaLabel,
  placeholder = "Selecciona",
  searchPlaceholder = "Buscar…",
  emptyMessage = "No hay resultados.",
  invalid,
  disabled,
  menuPortal = false,
  className,
}: {
  id: string;
  options: readonly SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  invalid?: boolean;
  disabled?: boolean;
  menuPortal?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalStyle, setPortalStyle] = useState<CSSProperties>();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const listboxId = `${id}-options`;

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) return [...options];
    return options.filter((option) => normalizeSearch(`${option.label} ${option.keywords ?? ""}`).includes(normalizedQuery));
  }, [options, query]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const updatePortalPosition = useCallback(() => {
    if (!menuPortal || !inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const viewportPadding = 16;
    const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
    const left = Math.min(Math.max(rect.left, viewportPadding), window.innerWidth - width - viewportPadding);
    const availableBelow = window.innerHeight - rect.bottom - viewportPadding;
    const placeAbove = availableBelow < 280 && rect.top > availableBelow;
    setPortalStyle(placeAbove
      ? { bottom: window.innerHeight - rect.top + 8, left, width }
      : { left, top: rect.bottom + 8, width });
  }, [menuPortal]);

  const openMenu = useCallback(() => {
    if (disabled) return;
    updatePortalPosition();
    setIsOpen(true);
    setQuery("");
    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(Math.max(selectedIndex, 0));
  }, [disabled, options, updatePortalPosition, value]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target) && !menuRef.current?.contains(target)) closeMenu();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (!isOpen || !menuPortal) return;
    updatePortalPosition();
    window.addEventListener("resize", updatePortalPosition);
    window.addEventListener("scroll", updatePortalPosition, true);
    return () => {
      window.removeEventListener("resize", updatePortalPosition);
      window.removeEventListener("scroll", updatePortalPosition, true);
    };
  }, [isOpen, menuPortal, updatePortalPosition]);

  const selectOption = (nextValue: string) => {
    onValueChange(nextValue);
    closeMenu();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const menu = isOpen ? (
    <div
      ref={menuRef}
      id={listboxId}
      role="listbox"
      aria-label={`Opciones de ${ariaLabel}`}
      style={menuPortal ? portalStyle : undefined}
      className={cn(
        "max-h-72 overflow-y-auto rounded-[var(--radius-md)] border border-border-strong bg-surface py-1 shadow-2xl",
        menuPortal ? "fixed z-[70]" : "absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full",
      )}
    >
      {filteredOptions.length ? filteredOptions.map((option, index) => {
        const selected = option.value === value;
        const active = index === activeIndex;
        return (
          <button
            key={option.value}
            id={`${listboxId}-${index}`}
            type="button"
            role="option"
            aria-selected={selected}
            className={cn(
              "flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left text-sm font-bold transition-colors hover:bg-surface-muted focus:outline-none",
              active ? "bg-surface-muted" : "",
              selected ? "text-primary" : "text-foreground",
            )}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => selectOption(option.value)}
          >
            <span className="min-w-0 truncate">{option.label}</span>
            {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
          </button>
        );
      }) : <p className="px-4 py-5 text-center text-sm text-muted">{emptyMessage}</p>}
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && filteredOptions.length ? `${listboxId}-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        value={isOpen ? query : (selectedOption?.label ?? "")}
        placeholder={isOpen ? searchPlaceholder : placeholder}
        autoComplete="off"
        className={cn(
          "min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface py-2 pl-10 pr-11 text-base text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none disabled:pointer-events-none disabled:bg-surface-muted disabled:opacity-60",
          className,
        )}
        onFocus={openMenu}
        onChange={(event) => {
          if (!isOpen) openMenu();
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) {
              openMenu();
              return;
            }
            const direction = event.key === "ArrowDown" ? 1 : -1;
            setActiveIndex((current) => (current + direction + filteredOptions.length) % Math.max(filteredOptions.length, 1));
          }
          if (event.key === "Enter" && isOpen && filteredOptions[activeIndex]) {
            event.preventDefault();
            selectOption(filteredOptions[activeIndex].value);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
          }
          if (event.key === "Tab") closeMenu();
        }}
      />
      <button
        type="button"
        aria-label={isOpen ? `Cerrar opciones de ${ariaLabel}` : `Mostrar opciones de ${ariaLabel}`}
        tabIndex={-1}
        disabled={disabled}
        className="absolute right-1 top-1 grid size-10 place-items-center rounded-[var(--radius-md)] text-muted hover:text-foreground disabled:pointer-events-none"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (isOpen) closeMenu();
          else {
            inputRef.current?.focus();
            openMenu();
          }
        }}
      >
        <ChevronDown aria-hidden="true" className={cn("size-5 transition-transform", isOpen ? "rotate-180 text-primary" : "")} />
      </button>
      {menuPortal && menu ? createPortal(menu, document.body) : menu}
    </div>
  );
}
