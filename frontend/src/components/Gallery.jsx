import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "../content.js";
import TravelAlbums from "./TravelAlbums.jsx";

export default function Gallery({ initialCollection = "gallery", standalone = false }) {
  const [active, setActive] = useState(null);
  const [items, setItems] = useState(content.gallery?.items || []);
  const [collection, setCollection] = useState(initialCollection);

  useEffect(() => {
    let alive = true;
    api.getGallery()
      .then((rows) => {
        if (alive && Array.isArray(rows)) setItems(rows);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const galleryItems = items.filter((item) => !item.category || item.category === "gallery");
  const travellingItems = items.filter((item) => item.category === "travelling");
  const displayedItems = collection === "travelling" ? travellingItems : galleryItems;

  return (
    <section id="gallery" className={`px-6 py-24 ${standalone ? "min-h-[70vh]" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 min-w-0">
          <span className="section-num">03.</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold min-w-0">gallery</h2>
          <span className="flex-1 h-px bg-border" />
        </div>
        {content.gallery?.subtitle && (
          <p className="text-muted text-lg max-w-2xl mb-12">{content.gallery.subtitle}</p>
        )}

        <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Gallery collection">
          {[
            { id: "gallery", label: "Gallery", count: galleryItems.length },
            { id: "travelling", label: "✈ Travelling", count: travellingItems.length },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                if (standalone) {
                  window.location.assign(c.id === "travelling" ? "/gallery/travelling" : "/gallery");
                } else {
                  setCollection(c.id);
                  setActive(null);
                }
              }}
              aria-pressed={collection === c.id}
              className={`rounded-full px-5 py-2 border transition-colors ${collection === c.id ? "bg-accent text-[#14181c] border-accent" : "bg-surface border-border text-muted hover:text-text"}`}
            >
              {c.label} <span className="opacity-70 text-xs ml-1">({c.count})</span>
            </button>
          ))}
        </div>

        {collection === "travelling" && <div className="mb-10"><TravelAlbums /></div>}
        {displayedItems.length === 0 && collection !== "travelling" && (
          <p className="text-muted py-8">No photos in this collection yet.</p>
        )}

        {/* CSS columns preserve each photo's natural aspect ratio. */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {displayedItems.map((item, i) => (
            <motion.button
              key={item.id ?? `${item.src}-${i}`}
              type="button"
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05 }}
              className="group relative block w-full mb-6 break-inside-avoid rounded-2xl overflow-hidden border border-border bg-surface text-left"
              aria-label={`View ${item.caption || "gallery item"}`}
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={item.src}
                    className="block w-full h-auto"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#14181c" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={item.src}
                  alt={item.caption || "Gallery item"}
                  loading="lazy"
                  className="block w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                />
              )}
              {item.caption && (
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent text-white text-sm px-4 py-3">
                  {item.caption}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4 sm:px-6 py-12 cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery photo viewer"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full cursor-default flex flex-col items-center"
            >
              {active.type === "video" ? (
                <video src={active.src} className="max-w-full max-h-[78vh] rounded-xl" controls autoPlay playsInline />
              ) : (
                <img src={active.src} alt={active.caption || "Gallery photo"} className="max-w-full max-h-[78vh] w-auto h-auto object-contain rounded-xl" />
              )}
              {active.caption && <p className="text-white/80 text-sm mt-3 text-center">{active.caption}</p>}
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute -top-5 right-0 sm:-right-5 w-10 h-10 rounded-full bg-white text-[#14181c] flex items-center justify-center font-bold shadow-lg"
                aria-label="Close photo viewer"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
