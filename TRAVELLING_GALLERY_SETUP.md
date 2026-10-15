# Travelling gallery

This version adds **Travelling** to the admin sidebar and a **Travelling** filter on the public Gallery.

1. Open Admin → Travelling and click **Add gallery photo**.
2. Upload a JPG/PNG/WebP through Cloudinary, or paste an HTTPS image URL.
3. Add a caption and click **Save photo**.
4. Open the public website Gallery and choose **Travelling**.

The existing `gallery_items.category` column is reused. No SQL migration is needed if your current gallery/social sections work.
