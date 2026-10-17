import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { getSocialEmbed } from "./SocialEmbed.jsx";

function youtubeThumbnail(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    let id = null;
    if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      id = u.pathname.split("/")[1];
    } else if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      id = u.searchParams.get("v") || u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1];
    }
    return /^[\w-]{11}$/.test(id || "") ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

function safeHttpsUrl(value) {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function SocialPost({ post }) {
  const originalUrl = safeHttpsUrl(post.link_url || post.src);
  const embed = originalUrl ? getSocialEmbed(originalUrl) : null;
  const platform = embed?.platform || "Social";
  const customThumbnail =
    post.src && post.src !== post.link_url && post.type !== "embed"
      ? safeHttpsUrl(post.src)
      : null;
  const thumbnail = customThumbnail || (platform === "YouTube" ? youtubeThumbnail(originalUrl) : null);
  const [playing, setPlaying] = useState(!thumbnail);
  const [imageFailed, setImageFailed] = useState(false);
  const showThumbnail = thumbnail && !imageFailed && !playing;

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="px-4 py-3 text-xs font-semibold text-accent">{platform}</div>

      {showThumbnail ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${platform} post${post.caption ? `: ${post.caption}` : ""}`}
          className="relative block w-full overflow-hidden bg-black/20 group"
          style={{ aspectRatio: embed?.ratio || "16/9", maxHeight: 560 }}
        >
          <img
            src={thumbnail}
            alt={post.caption || `${platform} video thumbnail`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/75 text-white text-3xl">▶</span>
          </span>
        </button>
      ) : embed ? (
        <div
          className="w-full overflow-hidden bg-black/10"
          style={{ aspectRatio: embed.ratio || "16/9", maxHeight: 560 }}
        >
          <iframe
            title={`${platform} post${post.caption ? `: ${post.caption}` : ""}`}
            src={embed.src}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-black/20 p-6 text-center">
          <span className="text-xl font-bold">{platform}</span>
          <span className="text-sm text-muted">Preview unavailable</span>
        </div>
      )}

      <div className="space-y-3 p-4">
        {post.caption && <p className="text-sm break-words">{post.caption}</p>}
        {originalUrl && (
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-semibold text-accent hover:underline"
          >
            Open on {platform} ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.getGallery()
      .then((items) => {
        if (mounted) setPosts(Array.isArray(items) ? items.filter((item) => item.category === "social") : []);
      })
      .catch((error) => console.error("Unable to load social posts", error));
    return () => { mounted = false; };
  }, []);

  if (!posts.length) return null;

  return (
    <section id="social-feed" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <span className="section-num">04.</span>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl md:text-4xl">social media</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <p className="mb-10 text-muted">A little more of what I've been sharing.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <SocialPost key={post.id} post={post} />)}
        </div>
      </div>
    </section>
  );
}
