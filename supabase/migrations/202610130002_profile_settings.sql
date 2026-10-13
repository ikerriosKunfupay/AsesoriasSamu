-- Ajustes básicos del perfil y avatar privado por cliente.

alter table public.profiles
add column if not exists avatar_path text;

create policy "profiles_update_own_basic" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant update (full_name, phone, avatar_path) on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-avatars',
  'profile-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "profile_avatars_select_own_or_admin" on storage.objects
for select to authenticated
using (
  bucket_id = 'profile-avatars'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

create policy "profile_avatars_insert_own" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile_avatars_update_own" on storage.objects
for update to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile_avatars_delete_own" on storage.objects
for delete to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
