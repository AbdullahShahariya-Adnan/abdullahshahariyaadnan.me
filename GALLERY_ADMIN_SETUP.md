# Admin gallery setup

This version adds a **Gallery** tab to `/admin`. Only a valid administrator token can create, edit, or delete gallery entries. Visitors can view the public gallery.

## 1. Database
In phpMyAdmin, choose `portfolio_db`, open **SQL**, and execute `database/gallery_migration.sql`. This creates only the `gallery_items` table; it does not delete or modify your existing tables or admin user.

## 2. Run locally
Start your existing backend (`npm install`, `npm run dev`) and frontend (`npm install`, `npm run dev`) with their working `.env` settings. Log in at `/admin` as your existing administrator. Click **Gallery**.

## 3. Add photos
Click **+ Add gallery photo**. You can paste an HTTPS image URL immediately. To upload an image from your computer, configure Cloudinary on the backend: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Then choose a JPG, PNG or WebP file (up to 5 MB), wait for upload success, enter a caption, and click **Save photo**.

The same Cloudinary upload endpoint is used for project covers and gallery photos, and it requires administrator authentication. Deleting a gallery entry removes its database reference, not the underlying Cloudinary asset. The original gallery image in `content.js` remains a fallback when the database gallery is empty.

## 4. Deploy
Push tested code to your existing GitHub repository. Deploy backend and frontend. **Also execute the gallery migration on your production MySQL database**; running it only on local XAMPP does not update production. Configure Cloudinary secrets only in your backend host, never in frontend variables or Git.

## Security test
Without logging in, `POST /api/gallery`, `PUT /api/gallery/1`, and `DELETE /api/gallery/1` must return HTTP 401. Public `GET /api/gallery` is allowed.

## Scope
Gallery photos and project cover images are supported. Video uploads are not included. New photos require a functioning backend, database, and (for direct uploads) Cloudinary configuration.

## Social media section (new)
The admin dashboard now has separate **Gallery** and **Social** tabs. In Social, upload a screenshot/cover photo, add a caption, and paste the public HTTPS URL of the original Instagram, Facebook, LinkedIn or other social post. On the homepage, visitors see a separate Social Media section with clickable **View original post** links. Posts are displayed as image previews, not platform-native embedded feeds.

**Database migration:** In phpMyAdmin select `portfolio_db`, then open `database/gallery_migration.sql`. If `gallery_items` doesn't exist, run the `CREATE TABLE` statement. Then run each of the two `ALTER TABLE` statements only when its column is missing. Do not re-run an ALTER for an existing column. Repeat on production database before deploying. Existing project data and administrator account remain untouched.
