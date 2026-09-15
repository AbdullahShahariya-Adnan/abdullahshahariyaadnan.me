import { motion } from "framer-motion";
import { content } from "../content.js";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function About() {
  const { about } = content;

  return (
    <section id="about" className="relative px-6 py-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none -translate-y-1/2"
        style={{ background: "var(--accent-2)" }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">about</h2>
          <span className="flex-1 h-px bg-border" />
        </motion.div>

        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-muted text-lg leading-relaxed mb-14 max-w-2xl"
        >
          {about.bio}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-display text-xl font-bold mb-1">{s.label}</p>
              <p className="text-sm text-muted">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
