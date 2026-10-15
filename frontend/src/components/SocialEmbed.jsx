import React from "react";

// Convert only known platform links to trusted embed endpoints; never render user-provided HTML.
export function getSocialEmbed(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password) return null;
    const h = u.hostname.toLowerCase();
    const host = (d) => h === d || h.endsWith("." + d);
    if (host("youtube.com") || host("youtu.be")) {
      const id = host("youtu.be") ? u.pathname.split("/")[1] : u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] || u.searchParams.get("v");
      if (!id || !/^[\w-]{11}$/.test(id)) return null;
      return { platform: "YouTube", src: `https://www.youtube-nocookie.com/embed/${id}`, ratio: "16/9" };
    }
    if (host("instagram.com")) {
      const m = u.pathname.match(/^\/(p|reel|tv)\/([\w-]+)/);
      if (!m) return null;
      return { platform: "Instagram", src: `https://www.instagram.com/${m[1]}/${m[2]}/embed/`, ratio: "4/5" };
    }
    if (host("tiktok.com")) {
      const m = u.pathname.match(/\/video\/(\d+)/);
      if (!m) return null;
      return { platform: "TikTok", src: `https://www.tiktok.com/embed/v2/${m[1]}`, ratio: "9/16" };
    }
    if (host("facebook.com") || host("fb.watch")) {
      const isVideo = /\/(videos|reel|watch)\/?|\/watch\//.test(u.pathname) || u.searchParams.has("v") || host("fb.watch");
      const endpoint = isVideo ? "video" : "post";
      return { platform: "Facebook", src: `https://www.facebook.com/plugins/${endpoint}.php?href=${encodeURIComponent(u.href)}&show_text=true&width=500`, ratio: isVideo ? "4/5" : "4/5" };
    }
  } catch { return null; }
  return null;
}

export default function SocialEmbed({ url, caption = "" }) {
  const embed = getSocialEmbed(url);
  if (!embed) return <div className="p-4 text-sm text-muted">Preview unavailable. <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline">Open original post ↗</a></div>;
  return <div className="w-full">
    <div className="px-4 py-2 text-xs font-semibold text-accent">{embed.platform}</div>
    <div className="w-full overflow-hidden bg-black/10" style={{ aspectRatio: embed.ratio, maxHeight: 560 }}>
      <iframe title={`${embed.platform} post ${caption}`} src={embed.src} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="w-full h-full border-0" />
    </div>
    <div className="p-3 text-sm"><a href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Open on {embed.platform} ↗</a></div>
  </div>;
}
