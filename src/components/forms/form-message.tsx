import type { ActionState } from "@/lib/forms/action-state";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message || state.status === "idle") return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={`rounded-[var(--radius-md)] px-4 py-3 text-sm font-bold ${
        state.status === "success"
          ? "bg-success-soft text-success"
          : "bg-danger-soft text-danger"
      }`}
    >
      {state.message}
    </p>
  );
}
