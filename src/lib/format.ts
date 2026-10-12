const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

export function formatDate(value: string | null | undefined) {
  if (!value) return "Sin fecha";
  return dateFormatter.format(new Date(value));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function statusLabel(value: string) {
  return ({ invited: "Invitado", active: "Activo", suspended: "Suspendido", archived: "Archivado", pending: "Pendiente", paid: "Pagada", waived: "Exenta", published: "Publicado", draft: "Borrador", new: "Nuevo", contacted: "Contactado", converted: "Convertido" } as Record<string, string>)[value] ?? value;
}
