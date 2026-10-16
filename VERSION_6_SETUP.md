# Portfolio Version 6 — Contact Inbox and Appearance Manager

## Included
- Existing V5 portfolio, travel albums, blog, projects and skills retained.
- Contact form: server-side validation, honeypot field, existing 15-minute API rate limit; stores messages in MySQL.
- Admin inbox: search/filter, New/Read/Replied statuses, delete, reply via mailto.
- Optional email notification via Resend API (not configured by default). Never expose API key to frontend.
- Appearance tab: primary/secondary accent colors, homepage section ordering and visibility, navbar and footer menu editing, admin color preview. Saving publishes immediately; there is no sitewide draft system.

## Database migrations (back up Aiven first)
Run any outstanding V2/V3/V5 migrations in order, then `database/v6_contact_appearance_migration.sql` **once**. V6 requires V3's `site_settings` table and existing `messages` table. If the status column already exists, skip the ALTER statement. The migration is not automatically executed.

## Backend / Render
Set existing environment variables as before. Optional notifications: `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL` (verified sender/domain). Node 18+ required for fetch. Messages still save if notification sending fails. Never put credentials in Git or Vercel frontend env.

## Frontend / Vercel
`cd frontend && npm ci && npm run build`. Check `VITE_API_URL` points to the correct Render API. Deploy backend first, then frontend. Verify mobile navigation, colors, album pages, admin messages, email delivery and browser console.

## Security notes
Honeypot and rate limits reduce spam but don't eliminate it; add Turnstile server verification if abuse occurs. Admin preview only previews colors on the admin screen; it is not a full site preview. Navbar links are limited to relative paths or HTTPS URLs. Review custom external links before saving. Use HTTPS for production.
