
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

function getPlatform(url = "") {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "instagram.com" || host.endsWith(".instagram.com")) return "Instagram";
    if (host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.watch") return "Facebook";
    if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be") return "YouTube";
    if (host === "tiktok.com" || host.endsWith(".tiktok.com")) return "TikTok";
  } catch {}
  return "Social";
}

function getYoutubeThumbnail(url = "") {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    let id = null;

    if (host === "youtu.be") {
      id = u.pathname.split("/")[1];
    } else if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      id = u.searchParams.get("v") ||
        u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1];
    }

    if (/^[\w-]{11}$/.test(id || "")) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {}
  return null;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    api.getGallery()
      .then((items) => {
        if (mounted) {
          setPosts(items.filter((item) => item.category === "social"));
        }
      })
      .catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  if (!posts.length) return null;

  return (
    <section id="social-feed" className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="section-num">04.</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold">
            social media
          </h2>
          <span className="flex-1 h-px bg-border" />
        </div>

        <p className="text-muted mb-10">
          A little more of what I've been sharing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const url = post.link_url || (post.type === "embed" ? post.src : "");
            const platform = getPlatform(url);
            const thumbnail =
              post.type === "embed"
                ? getYoutubeThumbnail(url)
                : post.src;

            return (
              <article
                key={post.id}
                className="rounded-xl overflow-hidden border border-border bg-surface"
              >
                <div className="px-4 py-3 text-xs font-semibold text-accent">
                  {platform}
                </div>

                <div className="relative aspect-video bg-black/20 overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={post.caption || `${platform} post`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                      <span className="text-2xl font-bold">{platform}</span>
                      <span className="text-sm text-muted">
                        View this post on {platform}
                      </span>
                    </div>
                  )}

                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${platform} post`}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors group"
                    >
                      <span className="rounded-full bg-black/70 text-white px-5 py-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                        View post ↗
                      </span>
                    </a>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {post.caption && (
                    <p className="text-sm">{post.caption}</p>
                  )}

                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm font-semibold hover:underline"
                    >
                      Open on {platform} ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
