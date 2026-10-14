"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, Check, ClipboardCheck, Dumbbell, TrendingUp, UserRound, UsersRound, X } from "lucide-react";

type NotificationCategory = "lead" | "client" | "questionnaire" | "check_in" | "workout_log";

export type AdminNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  href: string;
  read_at: string | null;
  created_at: string;
};

const categoryIcons = {
  lead: UserRound,
  client: UsersRound,
  questionnaire: ClipboardCheck,
  check_in: TrendingUp,
  workout_log: Dumbbell,
} satisfies Record<NotificationCategory, typeof Bell>;

function formatNotificationDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

export function NotificationCenter() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unreadCount = notifications.reduce((count, notification) => count + Number(!notification.read_at), 0);

  async function loadNotifications(signal?: AbortSignal) {
    try {
      const response = await fetch("/api/admin/notifications", { cache: "no-store", signal });
      if (!response.ok) throw new Error("request_failed");
      const payload = await response.json() as { notifications?: AdminNotification[] };
      setNotifications(payload.notifications ?? []);
      setError(null);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError("No se pudieron cargar los avisos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const initialLoad = window.setTimeout(() => void loadNotifications(controller.signal), 0);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadNotifications();
    }, 60_000);
    return () => {
      controller.abort();
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const closePanel = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closePanel);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closePanel);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  async function markAsRead(ids?: string[]) {
    const targetIds = ids ?? notifications.filter((notification) => !notification.read_at).map((notification) => notification.id);
    if (targetIds.length === 0) return;
    const readAt = new Date().toISOString();
    setNotifications((current) => current.map((notification) => (
      targetIds.includes(notification.id) ? { ...notification, read_at: readAt } : notification
    )));

    const response = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids ? { ids } : { all: true }),
    }).catch(() => null);
    if (!response?.ok) {
      setError("No se pudo guardar el estado de lectura.");
      void loadNotifications();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={unreadCount > 0 ? `Notificaciones: ${unreadCount} sin leer` : "Notificaciones"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
        className="relative grid size-11 place-items-center rounded-[var(--radius-md)] text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute right-0.5 top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-black leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <section
          id={panelId}
          aria-label="Centro de notificaciones"
          className="fixed inset-x-3 top-[4.5rem] z-50 flex max-h-[calc(100dvh-5.5rem)] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-2xl sm:left-auto sm:right-4 sm:w-[26rem]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <h2 className="text-base font-black">Notificaciones</h2>
              <p className="mt-0.5 text-xs text-muted">Actividad reciente de clientes e interesados</p>
            </div>
            <button type="button" aria-label="Cerrar notificaciones" onClick={() => setIsOpen(false)} className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] text-muted hover:bg-surface-muted hover:text-foreground">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {unreadCount > 0 ? (
            <button type="button" onClick={() => void markAsRead()} className="flex min-h-11 items-center justify-center gap-2 border-b border-border px-4 text-sm font-bold text-primary hover:bg-primary-soft">
              <Check className="size-4" aria-hidden="true" /> Marcar todo como leído
            </button>
          ) : null}

          <div className="overflow-y-auto overscroll-contain">
            {isLoading ? (
              <p className="p-6 text-center text-sm text-muted">Cargando notificaciones…</p>
            ) : notifications.length === 0 ? (
              <div className="grid place-items-center px-6 py-10 text-center">
                <Bell className="size-7 text-muted" aria-hidden="true" />
                <p className="mt-3 font-bold">Todo al día</p>
                <p className="mt-1 text-sm text-muted">Los nuevos formularios y seguimientos aparecerán aquí.</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => {
                  const Icon = categoryIcons[notification.category];
                  const isUnread = !notification.read_at;
                  return (
                    <li key={notification.id} className="border-b border-border last:border-b-0">
                      <Link
                        href={notification.href}
                        onClick={() => {
                          setIsOpen(false);
                          if (isUnread) void markAsRead([notification.id]);
                        }}
                        className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 p-4 transition-colors hover:bg-surface-muted ${isUnread ? "bg-primary-soft/60" : ""}`}
                      >
                        <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-start gap-2">
                            <span className="min-w-0 flex-1 text-sm font-black leading-5">{notification.title}</span>
                            {isUnread ? <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Sin leer" /> : null}
                          </span>
                          <span className="mt-1 block text-sm leading-5 text-muted">{notification.message}</span>
                          <time dateTime={notification.created_at} className="mt-2 block text-xs font-bold text-muted">{formatNotificationDate(notification.created_at)}</time>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {error ? <p role="status" className="border-t border-border px-4 py-3 text-xs font-bold text-danger">{error}</p> : null}
        </section>
      ) : null}
    </div>
  );
}
