import { AuthShell } from "@/components/layout/auth-shell";

export default function InactiveAccountPage() {
  return (
    <AuthShell title="Cuenta no disponible" description="Esta cuenta está inactiva. Contacta directamente con Team Ortega para revisar el acceso.">
      <p className="rounded-[var(--radius-md)] bg-warning-soft p-4 text-sm leading-6 text-warning">Por seguridad, no se muestra más información sobre el estado de la cuenta.</p>
    </AuthShell>
  );
}
