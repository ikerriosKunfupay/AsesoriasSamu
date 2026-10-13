export function HealthConsentField({ error }: { error?: string }) {
  return (
    <>
      <label
        className={`flex gap-3 rounded-[var(--radius-md)] border p-4 text-sm leading-6 transition-colors ${
          error
            ? "border-danger bg-danger-soft text-danger"
            : "border-border bg-surface-muted"
        }`}
      >
        <input
          name="healthConsent"
          type="checkbox"
          className={`mt-1 size-4 shrink-0 accent-primary ${
            error ? "outline-2 outline-offset-2 outline-danger" : ""
          }`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "healthConsent-error" : undefined}
          required
        />
        <span>Acepto que Team Ortega trate estos datos, incluidos los relativos a salud, únicamente para preparar y hacer seguimiento de mi plan.</span>
      </label>
      {error ? <p id="healthConsent-error" className="sr-only">{error}</p> : null}
    </>
  );
}
