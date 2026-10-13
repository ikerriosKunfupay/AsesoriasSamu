-- Cada plantilla de tarifa distingue modalidad y días de entrenamiento por semana.

alter table public.pricing_plans
add column if not exists service_modality public.service_modality;

alter table public.pricing_plans
add column if not exists days_per_week smallint
check (days_per_week between 1 and 7);

drop index if exists public.pricing_plans_active_name_idx;

create unique index if not exists pricing_plans_active_variant_idx
on public.pricing_plans (
  lower(name),
  billing_cycle,
  duration_months,
  service_modality,
  days_per_week
)
where active;
