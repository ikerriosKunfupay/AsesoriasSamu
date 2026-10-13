"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActionState } from "@/lib/forms/action-state";

export function FormMessage({ state }: { state: ActionState }) {
  const [dismissedState, setDismissedState] = useState<ActionState | null>(null);

  useEffect(() => {
    if (state.status !== "success" || !state.message) return;

    const timeoutId = window.setTimeout(() => setDismissedState(state), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [state]);

  if (!state.message || state.status === "idle" || dismissedState === state) return null;
  return (
    <div
      role={state.status === "error" ? "alert" : "status"}
      className={`flex items-start justify-between gap-4 rounded-[var(--radius-md)] px-4 py-3 text-sm font-bold ${
        state.status === "success"
          ? "bg-success-soft text-success"
          : "bg-danger-soft text-danger"
      }`}
    >
      <span>{state.message}</span>
      <button
        type="button"
        aria-label="Cerrar aviso"
        className="-m-1 shrink-0 rounded-full p-1 transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        onClick={() => setDismissedState(state)}
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
