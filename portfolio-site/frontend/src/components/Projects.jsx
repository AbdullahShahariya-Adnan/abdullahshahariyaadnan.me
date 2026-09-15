import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api.js";

const FALLBACK = [
  {
    id: 1,
    title: "Expense Tracker",
    description:
      "A full-stack expense management application that lets users track income and expenses, categorize transactions, and monitor spending habits.",
    tech_stack: "Angular,NestJS,MySQL,TypeScript",
    github_url: "https://github.com/AbdullahShahariya-Adnan",
  },
  {
    id: 2,
    title: "LearnTogether",
    description:
      "Educational web platform built for a university web programming project to support collaborative learning and resource sharing.",
    tech_stack: "HTML,CSS,JavaScript,SQL",
    github_url: "https://github.com/AbdullahShahariya-Adnan",
  },
];

const GRADIENTS = ["from-accent/25 to-accent2/25", "from-accent2/25 to-accent/25"];

export default function Projects() {
  const [projects, setProjects] = useState(FALLBACK);

  useEffect(() => {
    api
      .getProjects()
      .then((data) => data.length && setProjects(data))
      .catch(() => setProjects(FALLBACK));
  }, []);

  return (
    <section id="projects" className="px-6 py-24 bg-surface/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-1">
            <span className="section-num">02.</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">work</h2>
            <span className="flex-1 h-px bg-border" />
          </div>
          <Link to="/projects" className="text-sm font-medium text-accent hover:underline">
            View all projects →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent transition-colors"
            >
              <div
                className={`h-44 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}
              >
                <span className="font-display text-4xl font-semibold text-text/70">
                  {p.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tech_stack.split(",").slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-surfaceAlt text-muted"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">{p.description}</p>
                <div className="flex gap-5 text-sm">
                  <Link to={`/projects/${p.id}`} className="text-accent font-medium hover:underline">
                    View case study →
                  </Link>
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted font-medium hover:text-accent"
                    >
                      Source
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
