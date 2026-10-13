-- El backend usa la clave privada de Supabase para operaciones administrativas.
-- RLS sigue activa; este rol es exclusivamente servidor y nunca llega al navegador.

grant usage on schema public to service_role;

grant select, insert, update, delete on table
  public.profiles,
  public.leads,
  public.client_invitations,
  public.onboarding_submissions,
  public.consent_acceptances,
  public.workout_assignments,
  public.nutrition_assignments,
  public.workout_logs,
  public.check_ins,
  public.manual_fee_records,
  public.audit_events
to service_role;

grant usage, select on all sequences in schema public to service_role;

alter default privileges in schema public
grant select, insert, update, delete on tables to service_role;

alter default privileges in schema public
grant usage, select on sequences to service_role;
