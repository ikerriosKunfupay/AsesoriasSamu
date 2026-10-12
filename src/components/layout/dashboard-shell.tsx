import Link from "next/link";
import { type LucideIcon, Dumbbell, Home, LogOut, Menu, Salad, TrendingUp, UserRound, UsersRound, WalletCards } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string; icon: LucideIcon };

const adminItems: NavItem[] = [
  { href: "/admin", label: "Resumen", icon: Home },
  { href: "/admin/clientes", label: "Clientes", icon: UsersRound },
  { href: "/admin/interesados", label: "Interesados", icon: UserRound },
  { href: "/admin/entrenamientos", label: "Entrenamientos", icon: Dumbbell },
  { href: "/admin/nutricion", label: "Nutrición", icon: Salad },
  { href: "/admin/seguimientos", label: "Seguimientos", icon: TrendingUp },
  { href: "/admin/cuotas", label: "Cuotas", icon: WalletCards },
];

const clientItems: NavItem[] = [
  { href: "/app/inicio", label: "Inicio", icon: Home },
  { href: "/app/entrenamiento", label: "Entrenamiento", icon: Dumbbell },
  { href: "/app/nutricion", label: "Nutrición", icon: Salad },
  { href: "/app/seguimiento", label: "Seguimiento", icon: TrendingUp },
  { href: "/app/cuestionario", label: "Cuestionario", icon: UserRound },
];

export function DashboardShell({
  mode,
  userName,
  children,
}: {
  mode: "admin" | "client";
  userName: string;
  children: React.ReactNode;
}) {
  const items = mode === "admin" ? adminItems : clientItems;
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-zinc-800 bg-surface-inverse p-5 text-white lg:flex lg:flex-col">
        <BrandLogo href={mode === "admin" ? "/admin" : "/app/inicio"} className="mb-8 text-white" />
        <nav aria-label={mode === "admin" ? "Administración" : "Área personal"} className="grid gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-zinc-800 pt-5">
          <p className="mb-3 truncate text-sm font-bold text-white">{userName}</p>
          <form action={logoutAction}>
            <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white" type="submit">
              <LogOut className="size-4" /> Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
          <BrandLogo compact href={mode === "admin" ? "/admin" : "/app/inicio"} />
          <details className="relative">
            <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-[var(--radius-md)] border border-border" aria-label="Abrir navegación">
              <Menu className="size-5" />
            </summary>
            <nav className="absolute right-0 mt-2 grid w-64 gap-1 rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-md">
              {items.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-bold hover:bg-surface-muted">
                  <Icon className="size-5 text-primary" aria-hidden="true" /> {label}
                </Link>
              ))}
              <form action={logoutAction} className="border-t border-border pt-1">
                <Button type="submit" variant="ghost" className="w-full justify-start"><LogOut className="size-4" /> Cerrar sesión</Button>
              </form>
            </nav>
          </details>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

