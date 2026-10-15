import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import SocialEmbed from "./SocialEmbed.jsx";

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let mounted = true;
    api.getGallery().then((items) => {
      if (mounted) setPosts(items.filter((item) => item.category === "social"));
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  if (!posts.length) return null;
  return (
    <section id="social-feed" className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 min-w-0">
          <span className="section-num">04.</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold min-w-0">social media</h2>
          <span className="flex-1 h-px bg-border" />
        </div>
        <p className="text-muted mb-10">A little more of what I've been sharing.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl overflow-hidden border border-border bg-surface">
              {post.type === "embed" ? <SocialEmbed url={post.link_url || post.src} caption={post.caption} /> : <img src={post.src} alt={post.caption || "Social media post"} loading="lazy" className="w-full aspect-[4/3] object-cover" />}
              <div className="p-4 space-y-3">
                {post.caption && <p className="text-sm">{post.caption}</p>}
                {post.link_url && <a href={post.link_url} target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-semibold hover:underline">View original post ↗</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
