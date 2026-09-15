import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { api } from "../lib/api.js";

const FALLBACK = [
  {
    id: 1, title: "Expense Tracker",
    tagline: "A full-stack app for tracking spending and understanding where money actually goes.",
    tech_stack: "Angular,NestJS,MySQL,TypeScript,TypeORM",
    role: "University project (individual)", duration: "~4 weeks, plus later revisions",
    github_url: "https://github.com/AbdullahShahariya-Adnan",
  },
  {
    id: 2, title: "LearnTogether",
    tagline: "A collaborative learning platform built for a university web programming course.",
    tech_stack: "HTML,CSS,JavaScript,SQL",
    role: "University project (individual)", duration: "~3 weeks",
    github_url: "https://github.com/AbdullahShahariya-Adnan",
  },
];

const GRADIENTS = ["from-accent/25 to-accent2/25", "from-accent2/25 to-accent/25"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(FALLBACK);

  useEffect(() => {
    api.getProjects().then((data) => data.length && setProjects(data)).catch(() => setProjects(FALLBACK));
  }, []);

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold">work</h1>
            <span className="flex-1 h-px bg-border" />
          </div>
          <p className="text-muted text-lg max-w-2xl mb-14">
            Everything I've built so far, mostly through university coursework and self-directed
            practice. Each one links to a full write-up covering the stack, key features, and what
            I learned along the way.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent transition-colors"
              >
                <div className={`h-48 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                  <span className="font-display text-5xl font-semibold text-text/70">
                    {p.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="p-6">
                  {(p.role || p.duration) && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted mb-3">
                      {p.role && <span>{p.role}</span>}
                      {p.role && p.duration && <span>·</span>}
                      {p.duration && <span>{p.duration}</span>}
                    </div>
                  )}
                  <h2 className="font-display text-2xl font-semibold mb-2">{p.title}</h2>
                  <p className="text-muted text-sm leading-relaxed mb-4">{p.tagline || p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.tech_stack.split(",").map((t) => (
                      <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-surfaceAlt text-muted">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-5 text-sm">
                    <Link to={`/projects/${p.id}`} className="text-accent font-medium hover:underline">
                      View case study →
                    </Link>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="text-muted font-medium hover:text-accent">
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
