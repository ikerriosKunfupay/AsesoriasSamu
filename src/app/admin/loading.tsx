export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando panel" className="animate-pulse">
      <div className="mb-3 h-3 w-28 rounded-full bg-primary-soft" />
      <div className="h-10 w-64 max-w-full rounded-lg bg-border" />
      <div className="mt-3 h-5 w-full max-w-xl rounded-full bg-border" />
      <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
        <div className="h-14 border-b border-border bg-surface-muted" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid grid-cols-3 gap-5 border-b border-border p-5 last:border-b-0">
            <div className="h-5 rounded-full bg-border" />
            <div className="h-5 rounded-full bg-border" />
            <div className="h-5 rounded-full bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
