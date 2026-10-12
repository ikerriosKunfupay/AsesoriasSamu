-- Team Ortega · esquema inicial del MVP
-- Aplicar en un proyecto Supabase nuevo y exclusivo para esta aplicación.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'client');
create type public.profile_status as enum ('invited', 'active', 'suspended', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.user_role not null default 'client',
  status public.profile_status not null default 'invited',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  goal text not null,
  contact_preference text not null default 'whatsapp' check (contact_preference in ('whatsapp', 'phone', 'email')),
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'discarded')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  invited_by uuid not null references public.profiles(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  age smallint not null check (age between 16 and 90),
  sex text not null check (sex in ('mujer', 'hombre', 'otro', 'prefiero_no_indicar')),
  weight_kg numeric(5,2) not null check (weight_kg between 35 and 300),
  height_cm numeric(5,2) not null check (height_cm between 120 and 230),
  occupation_schedule text not null,
  training_priority text not null,
  meal_availability text not null,
  conditions_injuries text,
  allergies_intolerances text,
  goals text not null,
  social_networks text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consent_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null,
  policy_version text not null,
  accepted_at timestamptz not null default now(),
  unique (user_id, consent_type, policy_version)
);

create table public.workout_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  version integer not null default 1 check (version > 0),
  starts_on date,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.nutrition_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  version integer not null default 1 check (version > 0),
  starts_on date,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid references public.workout_assignments(id) on delete set null,
  completed_on date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  weight_kg numeric(5,2) check (weight_kg is null or weight_kg between 35 and 300),
  energy_level smallint not null check (energy_level between 1 and 5),
  adherence_level smallint not null check (adherence_level between 1 and 5),
  notes text,
  trainer_notes text,
  created_at timestamptz not null default now()
);

create table public.manual_fee_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  period text not null check (period ~ '^\d{4}-\d{2}$'),
  amount_eur numeric(8,2) not null check (amount_eur >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'waived')),
  notes text,
  recorded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, period)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index profiles_role_status_idx on public.profiles(role, status);
create index leads_created_at_idx on public.leads(created_at desc);
create index workout_assignments_client_idx on public.workout_assignments(client_id, created_at desc);
create index nutrition_assignments_client_idx on public.nutrition_assignments(client_id, created_at desc);
create index check_ins_client_idx on public.check_ins(client_id, created_at desc);
create index manual_fee_records_period_idx on public.manual_fee_records(period desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger onboarding_updated_at before update on public.onboarding_submissions for each row execute function public.set_updated_at();
create trigger workout_assignments_updated_at before update on public.workout_assignments for each row execute function public.set_updated_at();
create trigger nutrition_assignments_updated_at before update on public.nutrition_assignments for each row execute function public.set_updated_at();
create trigger manual_fee_records_updated_at before update on public.manual_fee_records for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, status)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'client', 'invited')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin' and status = 'active'
  );
$$;

create or replace function public.complete_onboarding()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  update public.profiles
  set onboarding_complete = true, status = 'active'
  where id = auth.uid() and role = 'client';
end;
$$;

revoke all on function public.is_admin(uuid) from public;
revoke all on function public.complete_onboarding() from public;
grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.complete_onboarding() to authenticated;

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.client_invitations enable row level security;
alter table public.onboarding_submissions enable row level security;
alter table public.consent_acceptances enable row level security;
alter table public.workout_assignments enable row level security;
alter table public.nutrition_assignments enable row level security;
alter table public.workout_logs enable row level security;
alter table public.check_ins enable row level security;
alter table public.manual_fee_records enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_manage" on public.profiles for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "leads_admin_only" on public.leads for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "invitations_admin_only" on public.client_invitations for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "onboarding_select_own_or_admin" on public.onboarding_submissions for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "onboarding_insert_own" on public.onboarding_submissions for insert to authenticated
with check (user_id = auth.uid());
create policy "onboarding_update_own" on public.onboarding_submissions for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "onboarding_admin_manage" on public.onboarding_submissions for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "consents_select_own_or_admin" on public.consent_acceptances for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "consents_insert_own" on public.consent_acceptances for insert to authenticated
with check (user_id = auth.uid());

create policy "workouts_client_read" on public.workout_assignments for select to authenticated
using ((client_id = auth.uid() and status = 'published') or public.is_admin());
create policy "workouts_admin_manage" on public.workout_assignments for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "nutrition_client_read" on public.nutrition_assignments for select to authenticated
using ((client_id = auth.uid() and status = 'published') or public.is_admin());
create policy "nutrition_admin_manage" on public.nutrition_assignments for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "workout_logs_select_own_or_admin" on public.workout_logs for select to authenticated
using (client_id = auth.uid() or public.is_admin());
create policy "workout_logs_insert_own" on public.workout_logs for insert to authenticated
with check (client_id = auth.uid());
create policy "workout_logs_admin_manage" on public.workout_logs for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "check_ins_select_own_or_admin" on public.check_ins for select to authenticated
using (client_id = auth.uid() or public.is_admin());
create policy "check_ins_insert_own" on public.check_ins for insert to authenticated
with check (client_id = auth.uid());
create policy "check_ins_admin_manage" on public.check_ins for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "fees_admin_only" on public.manual_fee_records for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "audit_admin_select" on public.audit_events for select to authenticated
using (public.is_admin());
create policy "audit_admin_insert" on public.audit_events for insert to authenticated
with check (public.is_admin() and actor_id = auth.uid());

revoke all on public.leads from anon;
revoke all on public.profiles from anon;
revoke all on public.onboarding_submissions from anon;
revoke all on public.consent_acceptances from anon;
revoke all on public.workout_assignments from anon;
revoke all on public.nutrition_assignments from anon;
revoke all on public.workout_logs from anon;
revoke all on public.check_ins from anon;
revoke all on public.manual_fee_records from anon;
revoke all on public.audit_events from anon;

grant select on public.profiles to authenticated;
grant select, insert, update on public.onboarding_submissions to authenticated;
grant select, insert on public.consent_acceptances to authenticated;
grant select on public.workout_assignments to authenticated;
grant select on public.nutrition_assignments to authenticated;
grant select, insert on public.workout_logs to authenticated;
grant select, insert on public.check_ins to authenticated;
