"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataViewToggle, usePersistedDataView } from "@/components/ui/data-view-toggle";
import { formatDate, statusLabel } from "@/lib/format";
import { leadReference } from "@/lib/leads/reference";

export type LeadCatalogItem = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  goal: string;
  contact_preference: string;
  created_at: string;
  status: string;
};

function LeadStatus({ lead }: { lead: LeadCatalogItem }) {
  return <Badge tone={lead.status === "new" ? "brand" : "neutral"}>{statusLabel(lead.status)}</Badge>;
}

function LeadContact({ lead }: { lead: LeadCatalogItem }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-black">{lead.full_name}</p>
      <a className="block truncate text-sm text-primary hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a>
      <a className="block text-sm text-muted hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a>
    </div>
  );
}

export function LeadsCatalog({ leads }: { leads: LeadCatalogItem[] }) {
  const [view, setView] = usePersistedDataView("team-ortega:leads-view");

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-5">
        <p className="text-sm font-bold text-muted">{leads.length} {leads.length === 1 ? "interesado" : "interesados"}</p>
        <DataViewToggle view={view} onChange={setView} label="Vista de interesados" />
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Referencia</th><th>Contacto</th><th>Objetivo</th><th>Preferencia</th><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>{leads.map((lead) => (
              <tr key={lead.id} id={`interesado-${lead.id}`} className="scroll-mt-24 target:bg-primary-soft">
                <td className="font-mono text-xs font-black">{leadReference(lead.id)}</td>
                <td><LeadContact lead={lead} /></td>
                <td className="max-w-md whitespace-pre-wrap text-sm">{lead.goal}</td>
                <td className="capitalize">{lead.contact_preference}</td>
                <td>{formatDate(lead.created_at)}</td>
                <td><LeadStatus lead={lead} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : null}

      {view === "list" ? (
        <div className="grid gap-3 p-4">
          {leads.map((lead) => (
            <article key={lead.id} id={`interesado-${lead.id}`} className="grid gap-4 rounded-[var(--radius-md)] border border-border p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] lg:items-center">
              <div><p className="font-mono text-xs font-black text-muted">{leadReference(lead.id)}</p><LeadContact lead={lead} /></div>
              <div><p className="text-xs font-black uppercase tracking-wide text-muted">Objetivo</p><p className="mt-1 whitespace-pre-wrap text-sm">{lead.goal}</p></div>
              <div className="grid justify-items-end gap-2"><LeadStatus lead={lead} /><p className="text-sm text-muted">{formatDate(lead.created_at)} · <span className="capitalize">{lead.contact_preference}</span></p></div>
            </article>
          ))}
        </div>
      ) : null}

      {view === "gallery" ? (
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {leads.map((lead) => (
            <article key={lead.id} id={`interesado-${lead.id}`} className="flex min-h-72 flex-col rounded-[var(--radius-md)] border border-border p-4">
              <div className="flex items-start justify-between gap-3"><p className="font-mono text-xs font-black text-muted">{leadReference(lead.id)}</p><LeadStatus lead={lead} /></div>
              <div className="mt-5"><LeadContact lead={lead} /></div>
              <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm">{lead.goal}</p>
              <p className="mt-auto pt-5 text-sm text-muted">{formatDate(lead.created_at)} · <span className="capitalize">{lead.contact_preference}</span></p>
            </article>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
