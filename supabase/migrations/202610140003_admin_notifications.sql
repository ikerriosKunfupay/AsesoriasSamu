-- Bandeja persistente de actividad entrante para administradores.

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  event_key text not null,
  category text not null check (category in ('lead', 'client', 'questionnaire', 'check_in', 'workout_log')),
  title text not null,
  message text not null,
  href text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (recipient_id, event_key)
);

create index if not exists admin_notifications_recipient_created_idx
on public.admin_notifications (recipient_id, created_at desc);

create index if not exists admin_notifications_recipient_unread_idx
on public.admin_notifications (recipient_id, created_at desc)
where read_at is null;

create or replace function public.create_admin_notification(
  notification_event_key text,
  notification_category text,
  notification_title text,
  notification_message text,
  notification_href text,
  notification_created_at timestamptz default now()
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.admin_notifications (
    recipient_id,
    event_key,
    category,
    title,
    message,
    href,
    created_at
  )
  select
    admin_profile.id,
    notification_event_key,
    notification_category,
    notification_title,
    notification_message,
    notification_href,
    notification_created_at
  from public.profiles as admin_profile
  where admin_profile.role = 'admin'
    and admin_profile.status = 'active'
  on conflict (recipient_id, event_key) do nothing;
$$;

create or replace function public.notify_admins_on_lead()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.create_admin_notification(
    'lead:' || new.id,
    'lead',
    'Nueva solicitud de información',
    new.full_name || ' quiere saber más sobre las asesorías.',
    '/admin/interesados#interesado-' || new.id,
    new.created_at
  );
  return new;
end;
$$;

create or replace function public.notify_admins_on_client()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role = 'client' then
    perform public.create_admin_notification(
      'client:' || new.id,
      'client',
      'Nuevo cliente registrado',
      coalesce(nullif(btrim(new.full_name), ''), 'Un nuevo cliente') || ' ya tiene una cuenta en Team Ortega.',
      '/admin/clientes/' || new.id || '?returnTo=%2Fadmin%2Fclientes',
      new.created_at
    );
  end if;
  return new;
end;
$$;

create or replace function public.notify_admins_on_questionnaire()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  client_name text;
begin
  select coalesce(nullif(btrim(full_name), ''), 'Un cliente')
  into client_name
  from public.profiles
  where id = new.user_id;

  perform public.create_admin_notification(
    'questionnaire:' || new.id,
    'questionnaire',
    'Cuestionario recibido',
    coalesce(client_name, 'Un cliente') || ' ha completado el cuestionario inicial.',
    '/admin/clientes/' || new.user_id || '?returnTo=%2Fadmin#cuestionario',
    new.submitted_at
  );
  return new;
end;
$$;

create or replace function public.notify_admins_on_check_in()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  client_name text;
begin
  select coalesce(nullif(btrim(full_name), ''), 'Un cliente')
  into client_name
  from public.profiles
  where id = new.client_id;

  perform public.create_admin_notification(
    'check-in:' || new.id,
    'check_in',
    'Nuevo seguimiento',
    coalesce(client_name, 'Un cliente') || ' ha enviado una nueva revisión.',
    '/admin/seguimientos#seguimiento-' || new.id,
    new.created_at
  );
  return new;
end;
$$;

create or replace function public.notify_admins_on_workout_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  client_name text;
begin
  select coalesce(nullif(btrim(full_name), ''), 'Un cliente')
  into client_name
  from public.profiles
  where id = new.client_id;

  perform public.create_admin_notification(
    'workout-log:' || new.id,
    'workout_log',
    'Entrenamiento completado',
    coalesce(client_name, 'Un cliente') || ' ha registrado un entrenamiento.',
    '/admin/clientes/' || new.client_id || '?returnTo=%2Fadmin',
    new.created_at
  );
  return new;
end;
$$;

drop trigger if exists leads_admin_notification on public.leads;
create trigger leads_admin_notification
after insert on public.leads
for each row execute function public.notify_admins_on_lead();

drop trigger if exists profiles_admin_notification on public.profiles;
create trigger profiles_admin_notification
after insert on public.profiles
for each row execute function public.notify_admins_on_client();

drop trigger if exists onboarding_admin_notification on public.onboarding_submissions;
create trigger onboarding_admin_notification
after insert on public.onboarding_submissions
for each row execute function public.notify_admins_on_questionnaire();

drop trigger if exists check_ins_admin_notification on public.check_ins;
create trigger check_ins_admin_notification
after insert on public.check_ins
for each row execute function public.notify_admins_on_check_in();

drop trigger if exists workout_logs_admin_notification on public.workout_logs;
create trigger workout_logs_admin_notification
after insert on public.workout_logs
for each row execute function public.notify_admins_on_workout_log();

alter table public.admin_notifications enable row level security;

drop policy if exists "admin_notifications_select_own" on public.admin_notifications;
create policy "admin_notifications_select_own" on public.admin_notifications
for select to authenticated
using (recipient_id = auth.uid() and public.is_admin());

drop policy if exists "admin_notifications_update_own" on public.admin_notifications;
create policy "admin_notifications_update_own" on public.admin_notifications
for update to authenticated
using (recipient_id = auth.uid() and public.is_admin())
with check (recipient_id = auth.uid() and public.is_admin());

revoke all on public.admin_notifications from anon, authenticated;
grant select on public.admin_notifications to authenticated;
grant update (read_at) on public.admin_notifications to authenticated;
grant select, insert, update, delete on public.admin_notifications to service_role;

revoke all on function public.create_admin_notification(text, text, text, text, text, timestamptz) from public;
revoke all on function public.notify_admins_on_lead() from public;
revoke all on function public.notify_admins_on_client() from public;
revoke all on function public.notify_admins_on_questionnaire() from public;
revoke all on function public.notify_admins_on_check_in() from public;
revoke all on function public.notify_admins_on_workout_log() from public;

-- Conserva actividad reciente al estrenar la bandeja sin inflar el contador:
-- los avisos históricos aparecen ya leídos y solo los siguientes serán nuevos.
insert into public.admin_notifications (
  recipient_id, event_key, category, title, message, href, read_at, created_at
)
select
  admin_profile.id,
  source.event_key,
  source.category,
  source.title,
  source.message,
  source.href,
  now(),
  source.created_at
from public.profiles as admin_profile
cross join lateral (
  select
    'lead:' || lead.id as event_key,
    'lead' as category,
    'Nueva solicitud de información' as title,
    lead.full_name || ' quiere saber más sobre las asesorías.' as message,
    '/admin/interesados#interesado-' || lead.id as href,
    lead.created_at
  from public.leads as lead
  where lead.created_at >= now() - interval '90 days'

  union all

  select
    'client:' || client.id,
    'client',
    'Nuevo cliente registrado',
    coalesce(nullif(btrim(client.full_name), ''), 'Un nuevo cliente') || ' ya tiene una cuenta en Team Ortega.',
    '/admin/clientes/' || client.id || '?returnTo=%2Fadmin%2Fclientes',
    client.created_at
  from public.profiles as client
  where client.role = 'client'
    and client.created_at >= now() - interval '90 days'

  union all

  select
    'questionnaire:' || questionnaire.id,
    'questionnaire',
    'Cuestionario recibido',
    coalesce(nullif(btrim(client.full_name), ''), 'Un cliente') || ' ha completado el cuestionario inicial.',
    '/admin/clientes/' || questionnaire.user_id || '?returnTo=%2Fadmin#cuestionario',
    questionnaire.submitted_at
  from public.onboarding_submissions as questionnaire
  join public.profiles as client on client.id = questionnaire.user_id
  where questionnaire.submitted_at >= now() - interval '90 days'

  union all

  select
    'check-in:' || check_in.id,
    'check_in',
    'Nuevo seguimiento',
    coalesce(nullif(btrim(client.full_name), ''), 'Un cliente') || ' ha enviado una nueva revisión.',
    '/admin/seguimientos#seguimiento-' || check_in.id,
    check_in.created_at
  from public.check_ins as check_in
  join public.profiles as client on client.id = check_in.client_id
  where check_in.created_at >= now() - interval '90 days'

  union all

  select
    'workout-log:' || workout_log.id,
    'workout_log',
    'Entrenamiento completado',
    coalesce(nullif(btrim(client.full_name), ''), 'Un cliente') || ' ha registrado un entrenamiento.',
    '/admin/clientes/' || workout_log.client_id || '?returnTo=%2Fadmin',
    workout_log.created_at
  from public.workout_logs as workout_log
  join public.profiles as client on client.id = workout_log.client_id
  where workout_log.created_at >= now() - interval '90 days'
) as source
where admin_profile.role = 'admin'
  and admin_profile.status = 'active'
on conflict (recipient_id, event_key) do nothing;
