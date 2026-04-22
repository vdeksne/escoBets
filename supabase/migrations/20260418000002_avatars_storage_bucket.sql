begin;

-- Public bucket for profile photos (RLS still restricts who can write).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Read: public bucket objects are readable (path still obscured by UUID folders).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'avatars_select_public'
  ) then
    create policy avatars_select_public
      on storage.objects
      for select
      to public
      using (bucket_id = 'avatars');
  end if;
end $$;

-- Write: only inside own folder `{auth.uid()}/...`
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'avatars_insert_own_folder'
  ) then
    create policy avatars_insert_own_folder
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'avatars'
        and split_part(name, '/', 1) = auth.uid()::text
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'avatars_update_own_folder'
  ) then
    create policy avatars_update_own_folder
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'avatars'
        and split_part(name, '/', 1) = auth.uid()::text
      )
      with check (
        bucket_id = 'avatars'
        and split_part(name, '/', 1) = auth.uid()::text
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'avatars_delete_own_folder'
  ) then
    create policy avatars_delete_own_folder
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'avatars'
        and split_part(name, '/', 1) = auth.uid()::text
      );
  end if;
end $$;

commit;
