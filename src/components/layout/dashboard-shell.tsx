"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { type LucideIcon, AlertCircle, BadgeCheck, ChevronDown, Dumbbell, Home, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Salad, Settings, Tags, TrendingUp, UserRound, UsersRound, WalletCards, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationCenter } from "@/components/layout/notification-center";

type NavItem = { href: string; label: string; icon: LucideIcon };
type CollapsibleGroupId = "advisories" | "payments";
type NavGroup = { id?: CollapsibleGroupId; label?: string; items: NavItem[] };

const adminGroups: NavGroup[] = [
  {
    items: [
      { href: "/admin", label: "Resumen", icon: Home },
      { href: "/admin/interesados", label: "Interesados", icon: UserRound },
    ],
  },
  {
    id: "advisories",
    label: "Asesorías",
    items: [
      { href: "/admin/clientes", label: "Clientes", icon: UsersRound },
      { href: "/admin/entrenamientos", label: "Entrenamientos", icon: Dumbbell },
      { href: "/admin/nutricion", label: "Nutrición", icon: Salad },
      { href: "/admin/seguimientos", label: "Seguimientos", icon: TrendingUp },
    ],
  },
  {
    id: "payments",
    label: "Pagos",
    items: [
      { href: "/admin/tarifas", label: "Tarifas", icon: Tags },
      { href: "/admin/cuotas", label: "Cuotas", icon: WalletCards },
    ],
  },
];

const clientGroups: NavGroup[] = [{
  items: [
    { href: "/app/inicio", label: "Inicio", icon: Home },
    { href: "/app/entrenamiento", label: "Entrenamiento", icon: Dumbbell },
    { href: "/app/nutricion", label: "Nutrición", icon: Salad },
    { href: "/app/seguimiento", label: "Seguimiento", icon: TrendingUp },
    { href: "/app/cuestionario", label: "Cuestionario", icon: UserRound },
    { href: "/app/ajustes", label: "Ajustes", icon: Settings },
  ],
}];

const SIDEBAR_STORAGE_KEY = "team-ortega:sidebar-open";
const SIDEBAR_GROUPS_STORAGE_KEY = "team-ortega:sidebar-groups";

function isCurrentNavItem(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
}

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
  const pathname = usePathname();
  const groups = mode === "admin" ? adminGroups : clientGroups;
  const [showOnboardingNotice, setShowOnboardingNotice] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<CollapsibleGroupId, boolean>>({
    advisories: false,
    payments: false,
  });
  const navigationLocked = mode === "client" && !onboardingComplete;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsDesktopSidebarOpen(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "false");
      const savedGroups = window.localStorage.getItem(SIDEBAR_GROUPS_STORAGE_KEY);
      if (!savedGroups) return;
      try {
        const parsed = JSON.parse(savedGroups) as Partial<Record<CollapsibleGroupId, boolean>>;
        setCollapsedGroups({
          advisories: parsed.advisories === true,
          payments: parsed.payments === true,
        });
      } catch {
        window.localStorage.removeItem(SIDEBAR_GROUPS_STORAGE_KEY);
      }
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

  function toggleNavigationGroup(groupId: CollapsibleGroupId) {
    setCollapsedGroups((current) => {
      const next = { ...current, [groupId]: !current[groupId] };
      window.localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function navigationGroups(surface: "sidebar" | "mobile") {
    return groups.map((group, index) => {
      const isCollapsed = group.id ? collapsedGroups[group.id] : false;
      const containsCurrentPage = group.items.some((item) => isCurrentNavItem(pathname, item.href));
      const groupItemsId = group.id ? `${surface}-${group.id}-navigation` : undefined;

      return (
      <div key={group.label ?? group.items[0]?.href} className={index > 0 ? "mt-4" : ""}>
        {group.label && group.id ? (
          <button
            type="button"
            aria-label={`${isCollapsed ? "Mostrar" : "Ocultar"} ${group.label}`}
            aria-expanded={!isCollapsed}
            aria-controls={groupItemsId}
            onClick={() => toggleNavigationGroup(group.id!)}
            className={`mb-1 flex min-h-9 w-full items-center justify-between rounded-[var(--radius-sm)] px-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary transition-colors ${surface === "sidebar" ? "hover:bg-sidebar-hover" : "hover:bg-surface-muted"} ${containsCurrentPage ? (surface === "sidebar" ? "bg-sidebar-hover" : "bg-surface-muted") : ""}`}
          >
            <span>{group.label}</span>
            <ChevronDown className={`size-4 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} aria-hidden="true" />
          </button>
        ) : group.label ? (
          <p className="mb-1 px-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">{group.label}</p>
        ) : null}
        <div id={groupItemsId} hidden={isCollapsed} className="grid gap-1">
          {group.items.map(({ href, label, icon: Icon }) => {
            const active = isCurrentNavItem(pathname, href);
            const activeClass = surface === "sidebar"
              ? "bg-sidebar-hover text-sidebar-foreground"
              : "bg-surface-muted text-foreground";
            const idleClass = surface === "sidebar"
              ? "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
              : "text-muted hover:bg-surface-muted hover:text-foreground";
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={(event) => guardNavigation(event, href)}
                className={`flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-bold transition-colors ${active ? activeClass : idleClass}`}
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      );
    });
  }

  function adminProfileIdentity(surface: "sidebar" | "mobile") {
    const active = pathname === "/admin/perfil";
    const activeClass = surface === "sidebar"
      ? "bg-sidebar-hover text-sidebar-foreground"
      : "bg-surface-muted text-foreground";
    const idleClass = surface === "sidebar"
      ? "text-sidebar-foreground hover:bg-sidebar-hover"
      : "text-foreground hover:bg-surface-muted";

    return (
      <Link
        href="/admin/perfil"
        aria-label={`Editar perfil de ${userName}`}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-12 min-w-0 items-center gap-3 rounded-[var(--radius-md)] px-2 transition-colors ${active ? activeClass : idleClass}`}
      >
        <ProfileAvatar name={userName} src={userAvatarUrl} className="size-10 text-xs" enlargeable={false} />
        <span className="min-w-0 flex-1 truncate text-sm font-bold">{userName}</span>
        <span className="shrink-0 text-primary" title="Cuenta verificada">
          <BadgeCheck className="size-5" aria-hidden="true" />
          <span className="sr-only">Cuenta verificada</span>
        </span>
      </Link>
    );
  }

  return (
    <div className={`min-h-screen bg-background lg:grid ${isDesktopSidebarOpen ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1"}`}>
      {isDesktopSidebarOpen ? (
      <aside className="hidden h-dvh self-start border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:flex-col">
        <div className="mb-3">
          <BrandLogo
            href={mode === "admin" ? "/admin" : "/app/inicio"}
            onClick={(event) => guardNavigation(event, "/app/inicio")}
            className="text-sidebar-foreground"
          />
        </div>
        <nav aria-label={mode === "admin" ? "Administración" : "Área personal"} className="mt-6">
          {navigationGroups("sidebar")}
        </nav>
        <div className="mt-auto border-t border-sidebar-border pt-5">
          {mode === "admin" ? (
            <div className="mb-3">{adminProfileIdentity("sidebar")}</div>
          ) : (
          <div className="mb-3 flex min-w-0 items-center gap-3 px-2">
            <ProfileAvatar name={userName} src={userAvatarUrl} className="size-10 text-xs" />
            <p className="min-w-0 truncate text-sm font-bold text-sidebar-foreground">{userName}</p>
          </div>
          )}
          <form action={logoutAction}>
            <Button variant="ghost" className="w-full justify-start text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground" type="submit">
              <LogOut className="size-4" /> Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      ) : null}
      <div className="min-w-0">
        {mode === "admin" ? (
          <div className="fixed right-4 top-2.5 z-30 lg:right-[10.75rem]">
            <NotificationCenter />
          </div>
        ) : null}
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-surface/95 px-4 pr-16 backdrop-blur lg:hidden">
          <details className="relative">
            <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-[var(--radius-md)] border border-border" aria-label="Abrir navegación">
              <Menu className="size-5" />
            </summary>
            <nav className="absolute left-0 mt-2 w-72 rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-md">
              {navigationGroups("mobile")}
              {mode === "admin" ? (
                <div className="mt-2 border-t border-border pt-2">{adminProfileIdentity("mobile")}</div>
              ) : null}
              <ThemeToggle className="w-full" />
              <form action={logoutAction} className="border-t border-border pt-1">
                <Button type="submit" variant="ghost" className="w-full justify-start"><LogOut className="size-4" /> Cerrar sesión</Button>
              </form>
            </nav>
          </details>
          <BrandLogo compact href={mode === "admin" ? "/admin" : "/app/inicio"} onClick={(event) => guardNavigation(event, "/app/inicio")} />
        </header>
        <div className="sticky top-0 z-20 hidden min-h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur lg:flex lg:px-10 xl:px-12">
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
        <main className="min-w-0 w-full max-w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 xl:px-12">{children}</main>
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

