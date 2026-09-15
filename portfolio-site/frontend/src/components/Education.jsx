import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api.js";

const FALLBACK = [
  {
    id: 1,
    degree: "B.Sc. in Computer Science",
    institution: "University of Pécs, Hungary",
    start_year: "2023",
    end_year: "2027",
    description:
      "Coursework spanning full-stack web development, Linux system administration, and networking fundamentals.",
  },
];

export default function Education() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api
      .getEducation()
      .then((data) => data.length && setItems(data))
      .catch(() => setItems(FALLBACK));
  }, []);

  return (
    <section id="education" className="px-6 py-24 bg-surface/40">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <span className="section-num">05.</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">education</h2>
          <span className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-surface flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <span className="text-sm font-medium text-accent2 whitespace-nowrap">
                {item.start_year} – {item.end_year}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">{item.degree}</h3>
                <p className="text-muted text-sm mt-1">{item.institution}</p>
                {item.description && (
                  <p className="text-muted text-sm mt-2 leading-relaxed">{item.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
