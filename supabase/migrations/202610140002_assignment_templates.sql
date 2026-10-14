-- Plantillas reutilizables privadas para entrenamientos y pautas nutricionales.

create table if not exists public.assignment_templates (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('workout', 'nutrition')),
  name text not null check (char_length(name) between 2 and 160),
  title text not null check (char_length(title) between 2 and 160),
  content text not null check (char_length(content) >= 20),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (created_by, kind, name)
);

drop trigger if exists assignment_templates_updated_at on public.assignment_templates;
create trigger assignment_templates_updated_at
before update on public.assignment_templates
for each row execute function public.set_updated_at();

alter table public.assignment_templates enable row level security;

drop policy if exists "assignment_templates_admin_own" on public.assignment_templates;
create policy "assignment_templates_admin_own" on public.assignment_templates
for all to authenticated
using (public.is_admin() and created_by = auth.uid())
with check (public.is_admin() and created_by = auth.uid());

revoke all on public.assignment_templates from anon;
grant select, insert, update, delete on public.assignment_templates to authenticated, service_role;

-- Al ser opcional, la ausencia de días debe seguir contando como una variante única.
drop index if exists public.pricing_plans_active_variant_idx;
create unique index pricing_plans_active_variant_idx
on public.pricing_plans (
  lower(name),
  billing_cycle,
  duration_months,
  service_modality,
  coalesce(days_per_week, 0)
)
where active;
