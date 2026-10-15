# Portfolio admin dashboard

## What changed
The existing `/admin` page now supports project image uploads, image URLs, previews, ordering, and clearer save errors. Uploaded images are hosted on Cloudinary; local disk uploads are intentionally avoided because Render disks can be ephemeral. The homepage and all-projects page display `image_url` from the database. The bundled LearnTogether image remains the fallback.

## Setup
1. Keep your current frontend and backend environment variables, including `VITE_API_URL`, `DATABASE_URL`/database credentials, `JWT_SECRET`, and `CORS_ORIGIN`.
2. On your backend host (e.g., Render), add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` as private environment variables from your Cloudinary account. Never put the API secret in Vite frontend variables or Git.
3. Redeploy the backend and frontend. Your MySQL projects table already has an `image_url` column, so no migration is needed if it matches `database/schema.sql`.
4. Sign in at `/admin` using your existing admin credentials. Open Projects, select New Project or Edit, upload an image or paste an HTTPS image URL, then Save.
5. If your backend is offline or the DB is not configured, project editing and publishing cannot work. The public site may show its static fallback projects.

## Scope
Project CRUD, project cover image uploads and ordering are supported. Editing arbitrary homepage sections, gallery content, About text and skills from admin is NOT implemented in this version. Those remain in `frontend/src/content.js` or their existing components. Do not upload confidential files. Image files must be JPG, PNG, or WebP, maximum 5 MB.
