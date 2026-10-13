"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

export function FormErrorToast({ message, messageId }: { message?: string; messageId?: string }) {
  const [dismissedId, setDismissedId] = useState<string>();

  if (!message || !messageId || dismissedId === messageId) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 z-50 flex w-[min(calc(100%-2rem),32rem)] -translate-x-1/2 items-start gap-3 border-l-4 border-white bg-danger px-4 py-3 text-sm font-bold text-white shadow-xl"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        className="-my-2 -mr-2 grid size-11 shrink-0 place-items-center text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={() => setDismissedId(messageId)}
        aria-label="Cerrar aviso"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
