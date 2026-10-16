# Portfolio Version 4 — changes and deployment

## Implemented
- Recruiter-oriented project case studies: retained existing detail pages, screenshots, role, challenges, technologies and demo/GitHub links.
- Interactive skills: category filtering, clickable skill-to-project matching, enhanced visual technology tiles, admin editing.
- Travel journal: searchable destinations, album stories, date/location, photo/video viewer, saved map-link directory, album covers, reorder controls and batch uploads.
- Admin control center: dashboard quick actions, Site Settings for project/skills/travel introductions, homepage, About and SEO defaults; project, skill, travel, social and gallery managers retained.
- Existing mobile breakpoints, responsive grids and Cloudinary optimized travel images retained.

## Important limits
- The destination map directory opens maps supplied in the admin. It is NOT an embedded pin map: latitude/longitude are not currently stored.
- No draft/publish workflow was added; saving content publishes immediately.
- Per-project social share previews are not guaranteed on a client-rendered SPA. Static previews or SSR/prerendering are needed for reliable social crawlers.
- Do not deploy without testing. No live MySQL or Cloudinary credentials are included.

## Database
1. Back up Aiven MySQL.
2. If not previously applied, run `database/travel_albums_migration.sql`, then `database/v3_content_migration.sql`. The V3 ALTER statements are not idempotent: skip columns that already exist.
3. V4 requires NO additional migration: extra section introductions use existing `site_settings` key/value table.

## Local verification
1. In `frontend`: `npm ci` then `npm run build` and `npm run dev`.
2. In `backend`: `npm ci`, configure the existing environment variables, and run the existing start script.
3. Test `/admin`, edit Site Settings, save a skill, create a travel album and open `/gallery/travelling`.
4. Commit and push to GitHub, then verify Render backend and Vercel frontend deployments.
5. Test mobile, uploads, navigation and metadata on the live domain.
