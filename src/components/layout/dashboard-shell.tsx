"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { type LucideIcon, AlertCircle, Dumbbell, Home, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Salad, Settings, Tags, TrendingUp, UserRound, UsersRound, WalletCards, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type NavItem = { href: string; label: string; icon: LucideIcon };

const adminItems: NavItem[] = [
  { href: "/admin", label: "Resumen", icon: Home },
  { href: "/admin/interesados", label: "Interesados", icon: UserRound },
  { href: "/admin/clientes", label: "Clientes", icon: UsersRound },
  { href: "/admin/entrenamientos", label: "Entrenamientos", icon: Dumbbell },
  { href: "/admin/nutricion", label: "Nutrición", icon: Salad },
  { href: "/admin/seguimientos", label: "Seguimientos", icon: TrendingUp },
  { href: "/admin/tarifas", label: "Tarifas", icon: Tags },
  { href: "/admin/cuotas", label: "Cuotas", icon: WalletCards },
];

const clientItems: NavItem[] = [
  { href: "/app/inicio", label: "Inicio", icon: Home },
  { href: "/app/entrenamiento", label: "Entrenamiento", icon: Dumbbell },
  { href: "/app/nutricion", label: "Nutrición", icon: Salad },
  { href: "/app/seguimiento", label: "Seguimiento", icon: TrendingUp },
  { href: "/app/cuestionario", label: "Cuestionario", icon: UserRound },
  { href: "/app/ajustes", label: "Ajustes", icon: Settings },
];

const SIDEBAR_STORAGE_KEY = "team-ortega:sidebar-open";

export function DashboardShell({
  mode,
  userName,
  userAvatarUrl,
  onboardingComplete = true,
  children,
}: {
  mode: "admin" | "client";
  userName: string;
  userAvatarUrl?: string | null;
  onboardingComplete?: boolean;
  children: React.ReactNode;
}) {
  const items = mode === "admin" ? adminItems : clientItems;
  const [showOnboardingNotice, setShowOnboardingNotice] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const navigationLocked = mode === "client" && !onboardingComplete;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsDesktopSidebarOpen(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "false");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!showOnboardingNotice) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowOnboardingNotice(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showOnboardingNotice]);

  function guardNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!navigationLocked || href === "/app/cuestionario") return;
    event.preventDefault();
    setShowOnboardingNotice(true);
  }

  function setDesktopSidebar(open: boolean) {
    setIsDesktopSidebarOpen(open);
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  }

  return (
    <div className={`min-h-screen bg-background lg:grid ${isDesktopSidebarOpen ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1"}`}>
      {isDesktopSidebarOpen ? (
      <aside className="hidden h-dvh self-start border-r border-zinc-800 bg-surface-inverse p-5 text-white lg:sticky lg:top-0 lg:flex lg:flex-col">
        <div className="mb-3">
          <BrandLogo
            href={mode === "admin" ? "/admin" : "/app/inicio"}
            onClick={(event) => guardNavigation(event, "/app/inicio")}
            className="text-white"
          />
        </div>
        <nav aria-label={mode === "admin" ? "Administración" : "Área personal"} className="mt-6 grid gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={(event) => guardNavigation(event, href)} className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-zinc-800 pt-5">
          <div className="mb-3 flex min-w-0 items-center gap-3">
            <ProfileAvatar name={userName} src={userAvatarUrl} className="size-10 border-zinc-700 bg-zinc-900 text-xs" />
            <p className="min-w-0 truncate text-sm font-bold text-white">{userName}</p>
          </div>
          <form action={logoutAction}>
            <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white" type="submit">
              <LogOut className="size-4" /> Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      ) : null}
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
          <details className="relative">
            <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-[var(--radius-md)] border border-border" aria-label="Abrir navegación">
              <Menu className="size-5" />
            </summary>
            <nav className="absolute left-0 mt-2 grid w-64 gap-1 rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-md">
              {items.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={(event) => guardNavigation(event, href)} className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-bold hover:bg-surface-muted">
                  <Icon className="size-5 text-primary" aria-hidden="true" /> {label}
                </Link>
              ))}
              <ThemeToggle className="w-full" />
              <form action={logoutAction} className="border-t border-border pt-1">
                <Button type="submit" variant="ghost" className="w-full justify-start"><LogOut className="size-4" /> Cerrar sesión</Button>
              </form>
            </nav>
          </details>
          <BrandLogo compact href={mode === "admin" ? "/admin" : "/app/inicio"} onClick={(event) => guardNavigation(event, "/app/inicio")} />
        </header>
        <div className="sticky top-0 z-20 hidden min-h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur lg:flex lg:px-8">
            <button
              type="button"
              aria-label={isDesktopSidebarOpen ? "Ocultar menú lateral" : "Mostrar menú lateral"}
              onClick={() => setDesktopSidebar(!isDesktopSidebarOpen)}
              className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-2.5 text-sm font-bold text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              {isDesktopSidebarOpen ? <PanelLeftClose className="size-5 text-primary" aria-hidden="true" /> : <PanelLeftOpen className="size-5 text-primary" aria-hidden="true" />}
              {isDesktopSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            </button>
            <ThemeToggle />
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      {showOnboardingNotice ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-8" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowOnboardingNotice(false);
        }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-required-title"
            aria-describedby="onboarding-required-description"
            className="relative w-full max-w-md border-l-[6px] border-primary bg-surface p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => setShowOnboardingNotice(false)}
              className="absolute right-4 top-4 grid size-10 place-items-center text-muted transition-colors hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <AlertCircle className="size-10 text-primary" aria-hidden="true" />
            <h2 id="onboarding-required-title" className="font-display mt-5 pr-10 text-3xl font-black uppercase leading-none">
              Completa primero tu cuestionario
            </h2>
            <p id="onboarding-required-description" className="mt-4 text-base leading-7 text-muted">
              Necesitamos esta información para preparar tu plan. Cuando lo guardes, podrás moverte libremente por toda tu área personal.
            </p>
            <Button className="mt-6 w-full" onClick={() => setShowOnboardingNotice(false)}>
              Completar cuestionario
            </Button>
          </section>
        </div>
      ) : null}
    </div>
  );
}

