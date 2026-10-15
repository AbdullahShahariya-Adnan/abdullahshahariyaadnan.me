# Social embeds update

Admin > Social > Add social post: paste a **public** Facebook, Instagram, YouTube or TikTok post URL and publish. No file upload needed. Do not paste iframe HTML.

**Existing database:** This uses existing `gallery_items` fields including `type`, `src`, `category`, and `link_url`. No new table is needed. Existing social photo entries continue to work.

**Platform limits:** Public post access, browser privacy settings, cookies, and platform restrictions can prevent playback. YouTube supports watch/shorts/live URLs, Instagram supports post/reel URLs, TikTok supports canonical `/@user/video/ID` URLs, and Facebook supports standard public post/reel/video URLs. Some Facebook share URLs and Instagram/TikTok restricted content cannot be embedded.

**Deployment:** Update frontend and backend together; run frontend build; redeploy your frontend and backend. Keep your working `.env` files and database.
