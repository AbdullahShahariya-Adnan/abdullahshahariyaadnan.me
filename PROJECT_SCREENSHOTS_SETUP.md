# Project screenshot gallery setup

1. Back up `portfolio_db` using phpMyAdmin Export.
2. In phpMyAdmin select the existing `portfolio_db`, click Import and choose `database/project_images_migration.sql`. This adds one new table and does not reset your admin or projects.
3. Keep your existing backend `.env` and Cloudinary credentials; never commit it.
4. Restart backend and frontend. In Admin > Projects, edit an existing project, upload an image, add a caption, then click **Add screenshot**. The screenshot is saved immediately. New projects must be saved first before screenshots can be added.
5. Open that project's public detail page. Click an image for a larger view and Previous/Next controls.
6. Apply the same migration to your production MySQL database before deploying to Render.

Screenshots are stored as Cloudinary HTTPS URLs in MySQL. Deleting a screenshot removes the database entry, not the Cloudinary asset. Only authenticated administrators can add or remove screenshots.
