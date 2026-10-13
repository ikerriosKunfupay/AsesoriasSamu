-- Notas privadas del entrenador, aisladas del perfil visible por el cliente.

create table if not exists public.client_admin_notes (
  client_id uuid primary key references public.profiles(id) on delete cascade,
  notes text not null default '' check (char_length(notes) <= 5000),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists client_admin_notes_updated_at on public.client_admin_notes;
create trigger client_admin_notes_updated_at
before update on public.client_admin_notes
for each row execute function public.set_updated_at();

alter table public.client_admin_notes enable row level security;

drop policy if exists "client_admin_notes_admin_only" on public.client_admin_notes;
create policy "client_admin_notes_admin_only" on public.client_admin_notes
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on public.client_admin_notes from anon;
grant select, insert, update, delete on public.client_admin_notes to authenticated, service_role;
