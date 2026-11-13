-- Manual review/run only. This file is NOT automatically applied by the app.
-- First inspect existing security and schema in the employees project's SQL editor.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename = 'event_sponsors')
   or (schemaname = 'storage' and tablename = 'objects');

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets where id = 'sponsor-logos';

select relrowsecurity from pg_class
where oid = 'public.event_sponsors'::regclass;

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'event_sponsors';

select conname, pg_get_constraintdef(oid)
from pg_constraint where conrelid = 'public.event_sponsors'::regclass;

-- Diagnose the account used in the website. Replace YOUR_USERNAME below.
-- SQL Editor runs as a database administrator: auth.uid() there is normally NULL,
-- so calling can_manage_event_sponsors() directly there does not test that user.
select p.id, p.username, p.is_active, p.role_id,
  exists (
    select 1 from public.role_pages rp
    join public.pages pg on pg.id = rp.page_id
    where rp.role_id = p.role_id and pg.path = '/admin/events'
  ) as has_events_page
from public.profiles p
where p.username = 'YOUR_USERNAME';

-- Both is_active and has_events_page must be true for the policies below.
-- If has_events_page is false, assign Events through the app's Roles screen
-- using an authorized administrator, then sign out and sign in again.

-- The UI writes sponsorship_type = 'Cash' or 'In-Kind', and uses NULL for
-- fields that do not apply to that type. Verify existing constraints permit this.
-- Review the statements below before executing. Do not add duplicate policies
-- if equivalent policies already exist. Existing permissive policies are ORed;
-- these policies cannot tighten any broader pre-existing grants.
-- No table or bucket is created, and no policy is removed or RLS disabled.

begin;

-- Match the app's active profiles and database-driven Events page permissions.
-- A fixed search_path and no caller parameters prevent caller-selected identities.
create or replace function public.can_manage_event_sponsors()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    join public.role_pages rp on rp.role_id = p.role_id
    join public.pages pg on pg.id = rp.page_id
    where p.id = auth.uid()
      and p.is_active = true
      and pg.path = '/admin/events'
  );
$$;

revoke all on function public.can_manage_event_sponsors() from public, anon;
grant execute on function public.can_manage_event_sponsors() to authenticated;

alter table public.event_sponsors enable row level security;

create policy "Events managers read sponsors"
on public.event_sponsors for select to authenticated
using (public.can_manage_event_sponsors());

create policy "Events managers add sponsors"
on public.event_sponsors for insert to authenticated
with check (public.can_manage_event_sponsors()
  and exists (select 1 from public.events e where e.id = event_id));

create policy "Events managers update sponsors"
on public.event_sponsors for update to authenticated
using (public.can_manage_event_sponsors())
with check (public.can_manage_event_sponsors()
  and exists (select 1 from public.events e where e.id = event_id));

create policy "Events managers delete sponsors"
on public.event_sponsors for delete to authenticated
using (public.can_manage_event_sponsors());

-- Required if table privileges have not already been granted. RLS still applies.
grant select, insert, update, delete on public.event_sponsors to authenticated;
-- If id uses a serial sequence without existing privileges, grant USAGE on
-- that specific sequence after inspecting column_default above.

-- New logos are stored as <event_id>/<uuid>.<png|jpg|webp>.
-- SELECT permits signed previews of existing legacy logos in this bucket too.
create policy "Events managers read sponsor logos"
on storage.objects for select to authenticated
using (bucket_id = 'sponsor-logos' and public.can_manage_event_sponsors());

create policy "Events managers upload sponsor logos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'sponsor-logos'
  and public.can_manage_event_sponsors()
  and exists (select 1 from public.events e
    where e.id::text = (storage.foldername(name))[1])
  and lower(storage.extension(name)) in ('png', 'jpg', 'webp')
);

create policy "Events managers delete sponsor logos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'sponsor-logos'
  and public.can_manage_event_sponsors()
  and exists (select 1 from public.events e
    where e.id::text = (storage.foldername(name))[1])
);

-- Enforce the upload limits on the existing bucket without changing its
-- public/private setting. The app supports private access via signed URLs.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']
where id = 'sponsor-logos';

commit;
