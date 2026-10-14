-- Planes de entrenamiento estructurados y registro por serie.
-- El plan permanece versionado en la asignacion; el cliente solo escribe sus resultados.

alter table public.workout_assignments
add column plan_data jsonb
check (plan_data is null or jsonb_typeof(plan_data) = 'object');

create table public.workout_set_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid not null references public.workout_assignments(id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 100),
  week_number smallint not null check (week_number between 1 and 16),
  session_number smallint not null check (session_number between 1 and 8),
  set_number smallint not null check (set_number between 1 and 5),
  load_kg numeric(7,2) check (load_kg is null or load_kg between 0 and 1000),
  reps smallint check (reps is null or reps between 0 and 500),
  rir numeric(3,1) check (rir is null or rir between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workout_set_logs_has_result check (load_kg is not null or reps is not null or rir is not null),
  unique (client_id, assignment_id, exercise_id, set_number)
);

create index workout_set_logs_assignment_idx
on public.workout_set_logs(client_id, assignment_id, week_number, session_number);

create trigger workout_set_logs_updated_at
before update on public.workout_set_logs
for each row execute function public.set_updated_at();

alter table public.workout_set_logs enable row level security;

create policy "workout_set_logs_select_own_or_admin"
on public.workout_set_logs for select to authenticated
using (client_id = auth.uid() or public.is_admin());

create policy "workout_set_logs_insert_own_published"
on public.workout_set_logs for insert to authenticated
with check (
  client_id = auth.uid()
  and exists (
    select 1
    from public.workout_assignments assignment
    where assignment.id = assignment_id
      and assignment.client_id = auth.uid()
      and assignment.status = 'published'
  )
);

create policy "workout_set_logs_update_own_published"
on public.workout_set_logs for update to authenticated
using (client_id = auth.uid())
with check (
  client_id = auth.uid()
  and exists (
    select 1
    from public.workout_assignments assignment
    where assignment.id = assignment_id
      and assignment.client_id = auth.uid()
      and assignment.status = 'published'
  )
);

create policy "workout_set_logs_delete_own"
on public.workout_set_logs for delete to authenticated
using (client_id = auth.uid());

create policy "workout_set_logs_admin_manage"
on public.workout_set_logs for all to authenticated
using (public.is_admin()) with check (public.is_admin());

revoke all on public.workout_set_logs from anon;
grant select, insert, update, delete on public.workout_set_logs to authenticated;
grant select, insert, update, delete on public.workout_set_logs to service_role;
