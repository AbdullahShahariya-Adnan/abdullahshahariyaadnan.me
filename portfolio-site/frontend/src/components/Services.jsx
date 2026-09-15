import { motion } from "framer-motion";
import { content } from "../content.js";

export default function Services() {
  return (
    <section id="services" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <span className="section-num">01.</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">what i do</h2>
          <span className="flex-1 h-px bg-border" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-border bg-surface"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
