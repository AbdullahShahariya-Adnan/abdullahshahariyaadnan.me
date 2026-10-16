import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "../content.js";
import TravelAlbums from "./TravelAlbums.jsx";

export default function Gallery({ initialCollection = "gallery", standalone = false }) {
  const [active, setActive] = useState(null);
  const [items, setItems] = useState(content.gallery?.items || []);
  useEffect(() => {
    let alive = true;
    api.getGallery().then((rows) => {
      if (alive && rows.length) setItems(rows);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const galleryItems = items.filter((item) => !item.category || item.category === "gallery");
  const travellingItems = items.filter((item) => item.category === "travelling");
  const [collection, setCollection] = useState(initialCollection);
  const displayedItems = collection === "travelling" ? travellingItems : galleryItems;
  // Keep the gallery visible even when only new travel albums exist.

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
          {[{id:"gallery",label:"Gallery",count:galleryItems.length},{id:"travelling",label:"✈ Travelling",count:travellingItems.length}].map(c => (
            <button key={c.id} type="button" onClick={() => { if (standalone) { window.location.assign(c.id === "travelling" ? "/gallery/travelling" : "/gallery"); } else { setCollection(c.id); setActive(null); } }} aria-pressed={collection === c.id} className={`rounded-full px-5 py-2 border transition-colors ${collection === c.id ? "bg-accent text-[#14181c] border-accent" : "bg-surface border-border text-muted hover:text-text"}`}>{c.label} <span className="opacity-70 text-xs ml-1">({c.count})</span></button>
          ))}
        </div>
        {collection === "travelling" && <div className="mb-10"><TravelAlbums /></div>}
        {displayedItems.length === 0 && collection !== "travelling" && <p className="text-muted py-8">No photos in this collection yet.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, i) => (
            <motion.button
              key={item.src}
              type="button"
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl overflow-hidden border border-border bg-surface aspect-[4/3] text-left"
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#14181c">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={item.src}
                  alt={item.caption || "Gallery item"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {item.caption && (
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm px-4 py-3">
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
            className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center px-6 py-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full cursor-default"
            >
              {active.type === "video" ? (
                <video src={active.src} className="w-full rounded-xl" controls autoPlay />
              ) : (
                <img src={active.src} alt={active.caption || ""} className="w-full rounded-xl" />
              )}
              {active.caption && (
                <p className="text-white/80 text-sm mt-3 text-center">{active.caption}</p>
              )}
              <button
                onClick={() => setActive(null)}
                className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white text-[#14181c] flex items-center justify-center font-bold"
                aria-label="Close"
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
