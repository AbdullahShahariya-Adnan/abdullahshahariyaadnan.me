# Portfolio V3 — install and deployment

## What changed
- Admin **Skills** tab: add/edit/delete/reorder skills in existing `skills` table.
- Admin **Site Settings** tab: editable SEO defaults and content fields, stored in new `site_settings` table.
- Travel album editing: location, visit date, map link, and multiline travel story; the public album displays these fields.
- Project case-study pages and interactive skill-to-project filtering were already present in V2 and are preserved.
- Public route metadata and mobile-friendly image loading enhancements. Client-side meta updates do NOT guarantee per-page social sharing previews in bots that do not run JavaScript.

## Database changes (Aiven MySQL)
1. **Back up the database first.**
2. If not already applied, run `database/travel_albums_migration.sql`.
3. Run `database/v3_content_migration.sql` in the EXISTING portfolio database, statement by statement. The ALTER TABLE commands should only be run once. If a column already exists, skip that ALTER.
4. No existing rows are deleted. The new settings table starts empty; defaults remain visible.

## Local testing
From `backend`: `npm ci`, configure existing `.env` locally, `npm start`.
From `frontend`: `npm ci`, configure `VITE_API_URL` in your local `.env`, `npm run build`, `npm run dev`.
Log in at `/admin`, test Skills, Site Settings, and Travel Albums. Confirm public skills, album stories and maps, and existing project pages.

## Deploy
Commit the updated code to your GitHub repo. Render should redeploy the Express backend; Vercel should redeploy the Vite frontend. Keep existing environment variables (JWT_SECRET, database credentials, CORS_ORIGIN, Cloudinary settings, VITE_API_URL) unchanged unless their actual values have changed. Do not commit `.env` files. Verify `/api/health` and `/api/settings` on Render, then check the website on desktop/mobile.

## SEO note
The React SPA sets meta tags after page load. Social crawlers often ignore client-side changes; for reliable **per-project** preview cards, use prerendering/SSR or server-side HTML meta injection. `index.html` provides site-wide fallback tags.

## Rollback
Restore previous deployed Git commit if needed. Keep database backup; new table/columns are additive.
