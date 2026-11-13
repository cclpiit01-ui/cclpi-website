# Sponsors Monitoring setup and verification

The feature uses the existing employees Supabase project, `event_sponsors`
table, and `sponsor-logos` bucket. No schema or policies are applied by the UI.
Live policies could not be verified from this workspace: it has no connected
Supabase administration tool, SQL migrations, or database connection credentials.
Browser API credentials do not provide access to PostgreSQL policy catalogs.

## Database review

If saving reports a row-level security violation, inspect the Toast's operation:
`uploading the logo to sponsor-logos` means the storage INSERT policy rejected
the upload when the accompanying message says RLS; `adding to event_sponsors` or `updating event_sponsors` means the
table policies rejected the write (or its returned row). A SELECT policy is also
required because saves return the stored row. Saving without a logo helps
isolate table permissions from storage permissions.

Run the username diagnostic query in the SQL file with the actual website
username. The profile must be active and its role must include `/admin/events`.
Use the existing Roles management UI to assign that page when appropriate.
The SQL Editor's administrator session does not represent the logged-in website
user, so an empty `auth.uid()` there is expected. Apply missing policies in the
employees project, not the separate public website Supabase project.

Upload failures now display the exact SDK message, HTTP status (`status`), and
Storage response code (`statusCode`) in both the Toast and a persistent form
error. An HTTP 400 alone cannot establish whether a policy change is needed.
For example, HTTP 400 can carry a Storage response code of 403 for RLS denial.
If the message says bucket not found, verify `sponsor-logos` exists in the
employees project; policies cannot fix a missing bucket. For MIME or size errors,
compare that bucket's allowed MIME types and size limit with PNG/JPEG/WEBP and
5,242,880 bytes. Do not solve authorization errors by making uploads public.

The separate `sponsors-monitoring-policies.sql` limits uploads to authenticated,
active profiles with Events page permission, existing event folders, and allowed
extensions. It grants no anonymous uploads. Run its inspection queries first;
only apply missing equivalent policies after reviewing the current grants.

Run the inspection queries at the top of `sponsors-monitoring-policies.sql`
in the employees project's SQL editor first. Review the proposed policies below
them and apply only missing equivalents. They authorize active profiles whose
role includes the `/admin/events` page. Confirm that this matches the intended
business access and that existing policies do not already grant broader access.
The SQL does not recreate the table, create the bucket, disable RLS, or make the
bucket public. Uploads need INSERT, previews need SELECT, and cleanup needs DELETE
on storage objects. Object UPDATE is unnecessary because uploads use unique names.

The UI writes `Cash` and `In-Kind` as sponsorship types. Fields not applicable to
the selected type are NULL. Confirm column constraints permit those values before
using the feature. Cash rows use `amount`; In-Kind rows use `item_description`,
`quantity`, and `estimated_value`. Estimated value is already the total, not a
per-item price. Missing sponsorship types in legacy rows are treated as Cash.

Logos are stored as bucket-relative paths in `logo_url`:
`<event_id>/<uuid>.<extension>`. Existing Supabase sponsor-logos URLs are also
recognized. Previews use renewable signed URLs; exported spreadsheets contain
storage paths rather than temporary signed URLs. Old files are cleaned up after
successful replacement or deletion, but only when under the current event's
folder. Cleanup errors are reported separately and may need administrator action.
Table writes and storage operations are separate API requests, not a transaction.

## Manual acceptance checks with an authorized account

1. Open Sponsors on two different events. Confirm each starts with its own list,
   and that search, forms, and filters reset when switching events.
2. Add a Cash sponsor for PHP 1,500 and an In-Kind sponsor with quantity 3 and
   estimated total PHP 900. Check totals: 2 sponsors, PHP 1,500 cash, PHP 900
   In-Kind, PHP 2,400 combined. Reload the modal to confirm persistence.
3. Search by name and item description; select Cash and In-Kind filters. Export
   each filtered list and verify numeric amounts, quantities, and matching rows.
   Dashboard totals should continue to cover the entire selected event.
4. Add/edit sponsors with PNG, JPG, and WEBP logos. Confirm thumbnail and large
   preview work with a private bucket. Reject other formats, empty files, and
   files above 5 MB. Confirm editing without selecting a logo preserves it.
5. Switch sponsorship type while editing and confirm inactive type fields clear
   in the database. Check blank names, negative values, and invalid quantities
   are rejected. Zero monetary values are allowed.
6. Cancel a deletion; then confirm one. Confirm counts and values update and
   the event remains unaffected. Check replacement/deletion storage cleanup.
7. Test an unauthorized account and an unauthenticated client against both the
   table and bucket. Verify denied access at the API level, independently of UI.
8. Test database/storage errors and interrupted requests. Verify error Toasts,
   preserved form input after failure, and disabled actions during mutations.
9. Recheck existing event editing, invitations, public RSVP, invitation responses,
   and QR downloads. Their implementation has not been changed by this feature.

Automated checks run locally: production Vite build and ESLint for the new
component. Authenticated CRUD and policy enforcement require the live project
and have not been exercised in this workspace.
