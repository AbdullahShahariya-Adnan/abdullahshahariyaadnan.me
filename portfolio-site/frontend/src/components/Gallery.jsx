import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "../content.js";

export default function Gallery() {
  const [active, setActive] = useState(null);
  const items = content.gallery?.items || [];

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="section-num">03.</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">gallery</h2>
          <span className="flex-1 h-px bg-border" />
        </div>
        {content.gallery?.subtitle && (
          <p className="text-muted text-lg max-w-2xl mb-12">{content.gallery.subtitle}</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
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
