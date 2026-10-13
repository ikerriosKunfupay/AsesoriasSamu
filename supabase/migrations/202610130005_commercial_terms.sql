-- Tarifas reutilizables y condiciones comerciales privadas por cliente.

do $$
begin
  create type public.billing_cycle as enum ('monthly', 'semiannual', 'annual', 'custom');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.service_modality as enum ('in_person', 'online');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  billing_cycle public.billing_cycle not null,
  duration_months smallint not null default 1 check (duration_months between 1 and 120),
  default_amount_eur numeric(8,2) not null check (default_amount_eur >= 0),
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricing_plans
add column if not exists duration_months smallint not null default 1
check (duration_months between 1 and 120);

create unique index if not exists pricing_plans_active_name_idx
on public.pricing_plans (lower(name))
where active;

create table if not exists public.client_commercial_terms (
  client_id uuid primary key references public.profiles(id) on delete cascade,
  modality public.service_modality not null,
  pricing_plan_id uuid references public.pricing_plans(id) on delete set null,
  agreed_amount_eur numeric(8,2) not null check (agreed_amount_eur >= 0),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists pricing_plans_updated_at on public.pricing_plans;
create trigger pricing_plans_updated_at
before update on public.pricing_plans
for each row execute function public.set_updated_at();

drop trigger if exists client_commercial_terms_updated_at on public.client_commercial_terms;
create trigger client_commercial_terms_updated_at
before update on public.client_commercial_terms
for each row execute function public.set_updated_at();

alter table public.pricing_plans enable row level security;
alter table public.client_commercial_terms enable row level security;

drop policy if exists "pricing_plans_admin_only" on public.pricing_plans;
create policy "pricing_plans_admin_only" on public.pricing_plans
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "client_commercial_terms_admin_only" on public.client_commercial_terms;
create policy "client_commercial_terms_admin_only" on public.client_commercial_terms
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on public.pricing_plans from anon;
revoke all on public.client_commercial_terms from anon;
grant select, insert, update, delete on public.pricing_plans to authenticated, service_role;
grant select, insert, update, delete on public.client_commercial_terms to authenticated, service_role;
