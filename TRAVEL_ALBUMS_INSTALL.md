# Travel albums + admin improvements

## Deployment checklist

1. Back up your Aiven MySQL database. In DBeaver, connect to the same database your Render backend uses and run `database/travel_albums_migration.sql` **once**. This adds two tables; it does not modify existing gallery data.
2. Replace your working project with the updated source (or review the diff and merge). Keep your own `.env` files and secrets outside the ZIP.
3. In `frontend/`, run `npm install` then `npm run build`. In `backend/`, run `npm install` and start with `npm start`.
4. Confirm the Render environment has `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `JWT_SECRET`, your MySQL variables, and `CORS_ORIGIN` including your Vercel domain. Do not put Cloudinary secrets in the frontend.
5. Deploy backend to Render and frontend to Vercel using your existing GitHub workflow.
6. Sign in at `/admin` > **Travel Albums** > **Create album**. Enter Bulgaria, cover photo and description. Click the album to add photos/videos (multi-file uploads or direct URLs). Visit `/gallery/travelling` to verify.
7. For Social Media, edit a post and upload a thumbnail or paste a Cloudinary thumbnail URL. The original post URL remains clickable.

## Notes and limits

- Files uploaded from the admin panel are sent through the authenticated Express backend to Cloudinary. Images: JPG, PNG, WebP. Videos: MP4, WebM, MOV. Maximum 25 MB per file; multi-upload sends files sequentially. Larger videos should be uploaded to Cloudinary directly and added using the HTTPS media URL.
- Album deletion removes its MySQL records, **not** the original Cloudinary files. Delete originals separately in Cloudinary if desired.
- New albums are separate from existing legacy `gallery_items` in the Travelling category. Existing travelling photos remain displayed below the album grid until manually moved; there is no automatic migration.
- Facebook/Instagram embedding is controlled by those platforms; custom thumbnails with click-through links are more reliable.
- This is a source-code update; live Aiven/Render/Vercel deployment and browser testing are not performed here.
- Suggested next improvements: drag-and-drop ordering, bulk album cover selection, automatic image optimization, pagination for large collections, and a confirmation/undo flow for deletions.

## Additional admin improvements (v2)

- **Drag and drop ordering:** In Admin > Travel Albums > open an album, drag a photo/video card to a new position. The new order is saved to MySQL using the existing authenticated API. On touch devices, use the left/right arrow controls instead.
- **Choose cover from photos:** Click **Use as cover** on an uploaded photo. This updates the album cover in MySQL without requiring a second upload.
- **Automatic image compression:** Large JPEG and WebP files (800 KB+) are resized to a maximum dimension of 2200 pixels and converted to WebP at 82% quality in the browser *only if the result is smaller*. PNGs and videos are uploaded unchanged. Original photos on your computer are never modified. If browser optimization fails, the original file is uploaded.
- **Optimized public images:** Cloudinary-hosted images are delivered with `f_auto,q_auto` and a responsive width. This changes the delivery URL only; it does not modify Cloudinary originals. Non-Cloudinary URLs are unchanged.

**Testing:** Upload several photos and one video to a test album; drag to reorder; refresh the page and verify the order; select a cover; refresh the public Travelling page and verify the cover. Check a large image upload and test on mobile. If using Cloudinary URLs that already include custom transformations, review resulting delivery URLs before launch.
