# Version 5 — Global Footer + IT / Travel Blog

## Added
- Responsive footer on all public pages: navigation, blog, contact, social links; footer introduction editable in Site Settings.
- Blog index `/blog`, IT/Travelling filters, article detail `/blog/:slug`.
- Admin `Blog Posts` tab: create, edit, delete, drafts, publish, cover URL, excerpt, body, category.
- Blog data in MySQL; public endpoints expose only published posts.

## Before deployment
1. Back up your Aiven MySQL database. Apply prior Version 2/3 migrations if not already applied.
2. Run `database/v5_blog_migration.sql` in Aiven (DBeaver works). It creates a new table only.
3. In frontend run `npm ci && npm run build`; in backend run `npm ci` and start using your usual environment variables.
4. Test admin login and the Blog Posts tab; create a draft (should NOT appear publicly), then publish and confirm `/blog` and `/blog/your-slug`.
5. Deploy backend to Render and frontend to Vercel; preserve existing environment variables, domains and CORS settings.

## Notes
- This footer follows the reference layout but deliberately does not copy the reference business name, phone number, or newsletter functionality.
- Newsletter signup is intentionally not present because no email subscription provider was configured; adding a nonfunctional signup would mislead visitors.
- Blog content uses plain text with preserved paragraphs for safety. Rich text, categories beyond IT/Travelling, and scheduled publishing are future enhancements.
- For reliable per-article social sharing previews on Facebook/LinkedIn, prerendered or server-rendered HTML meta tags are still recommended. Client-side document titles alone cannot guarantee previews.
