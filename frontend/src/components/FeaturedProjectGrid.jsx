import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const accents = ["#38a9ff", "#cb83ff", "#22d3a5", "#ffa845", "#8c91ff", "#f472b6"];

export default function FeaturedProjectGrid({ projects = [], limit }) {
  const shown = typeof limit === "number" ? projects.slice(0, limit) : projects;
  if (!shown.length) return <p className="text-center text-muted py-10">Projects will appear here once they're added in the admin panel.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {shown.map((p, i) => {
        const color = accents[i % accents.length];
        const tags = String(p.tech_stack || "").split(",").map(x => x.trim()).filter(Boolean);
        const image = p.image_url || (String(p.title).toLowerCase().replace(/\s+/g, "") === "learntogether" ? "/projects/learn-together.png" : "");
        return (
          <motion.article key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: Math.min(i, 5) * 0.06 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1d2b3d] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl">
            <Link to={`/projects/${p.id}`} className="block h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-[#17445b] to-[#32254e]" aria-label={`View ${p.title}`}>
              {image ? <img src={image} alt={`${p.title} project screenshot`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="h-full flex items-center justify-center text-white/60 font-display text-5xl font-bold" aria-hidden="true">{String(p.title).split(" ").map(w => w[0]).join("").slice(0, 2)}</div>}
            </Link>
            <div className="p-5 flex flex-col flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">{tags.slice(0, 3).map(tag => <span key={tag} className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${color}1c`, color }}>{tag}</span>)}</div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mb-2 break-words">{p.title}</h3>
              <p className="text-[#aebaca] text-sm leading-relaxed mb-5 flex-1 break-words">{p.tagline || p.description || "Explore this project and the technologies behind it."}</p>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                <Link to={`/projects/${p.id}`} className="text-sm font-semibold hover:underline" style={{ color }}>View Project <span aria-hidden="true">→</span></Link>
                <div className="flex gap-2">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} source code`} title="GitHub" className="rounded-lg bg-white/10 hover:bg-white/20 text-white p-2 text-xs">GitHub ↗</a>}
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} live website`} title="Live demo" className="rounded-lg bg-white/10 hover:bg-white/20 text-white p-2 text-xs">Live ↗</a>}
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
