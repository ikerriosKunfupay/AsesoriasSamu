-- Objetivos personales del panel de administración.

create table if not exists public.admin_dashboard_settings (
  admin_id uuid primary key references public.profiles(id) on delete cascade,
  monthly_revenue_goal_eur numeric(10,2) not null default 0 check (monthly_revenue_goal_eur >= 0),
  active_clients_goal integer not null default 0 check (active_clients_goal >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists admin_dashboard_settings_updated_at on public.admin_dashboard_settings;
create trigger admin_dashboard_settings_updated_at
before update on public.admin_dashboard_settings
for each row execute function public.set_updated_at();

alter table public.admin_dashboard_settings enable row level security;

drop policy if exists "dashboard_settings_admin_own" on public.admin_dashboard_settings;
create policy "dashboard_settings_admin_own" on public.admin_dashboard_settings
for all to authenticated
using (public.is_admin() and admin_id = auth.uid())
with check (public.is_admin() and admin_id = auth.uid());

revoke all on public.admin_dashboard_settings from anon;
grant select, insert, update, delete on public.admin_dashboard_settings to authenticated, service_role;
