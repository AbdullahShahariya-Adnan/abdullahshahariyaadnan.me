import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { api } from "../lib/api.js";

const FALLBACK = {
  1: {
    id: 1, title: "Expense Tracker",
    tagline: "A full-stack app for tracking spending and understanding where money actually goes.",
    long_description: "Expense Tracker started as a university assignment and grew into a more complete personal finance tool. The backend is built with NestJS and TypeORM on top of MySQL, exposing a REST API for transactions, categories, and analytics. The Angular frontend uses standalone components and a custom dark financial UI designed to make numbers easy to scan at a glance.",
    role: "University project (individual)", duration: "~4 weeks, plus later revisions",
    tech_stack: "Angular,NestJS,MySQL,TypeScript,TypeORM",
    features: "Transaction CRUD with categorization,Monthly spending analytics and summaries,Custom dark financial UI,REST API with TypeORM entities,Environment-based configuration and CORS setup",
    challenges: "Getting TypeORM relations and migrations to behave consistently across environments,Structuring analytics queries to stay fast as transaction volume grows,Keeping the Angular services and NestJS DTOs in sync as the schema evolved",
    github_url: "https://github.com/AbdullahShahariya-Adnan",
  },
  2: {
    id: 2, title: "LearnTogether",
    tagline: "A collaborative learning platform built for a university web programming course.",
    long_description: "LearnTogether was built for a web programming course with the goal of giving students a simple place to share notes, resources, and study materials with each other. It uses vanilla HTML, CSS, and JavaScript on the frontend with a SQL backend — a deliberate choice to practice the fundamentals of web development without leaning on a framework.",
    role: "University project (individual)", duration: "~3 weeks",
    tech_stack: "HTML,CSS,JavaScript,SQL",
    features: "User accounts and authentication,Posting and browsing shared study resources,Search and filtering by subject,Responsive layout with vanilla CSS",
    challenges: "Structuring the SQL schema before any frontend existed to make sure the data model actually supported the features,Writing plain JavaScript DOM logic without a framework to manage state,Keeping styling consistent across pages without a CSS framework",
    github_url: "https://github.com/AbdullahShahariya-Adnan",
  },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(FALLBACK[id] || null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenshots, setScreenshots] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    setScreenshots([]); setSelectedScreenshot(null);
    api.getProjectImages(id).then(setScreenshots).catch(() => {});
    setLoading(true);
    setNotFound(false);
    setProject(FALLBACK[id] || null);
    api.getProject(id).then(setProject).catch(() => {
      if (FALLBACK[id]) setProject(FALLBACK[id]);
      else setNotFound(true);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading && !project) return <><Navbar /><main className="min-h-[60vh] px-6 pt-40 text-center text-muted">Loading project…</main><Footer /></>;

  if (notFound || !project) {
    return (
      <>
        <Navbar />
        <main className="px-6 pt-40 pb-24 text-center">
          <p className="text-muted">That project doesn't exist.</p>
          <Link to="/projects" className="text-accent hover:underline mt-4 inline-block">← Back to all projects</Link>
        </main>
        <Footer />
      </>
    );
  }

  const features = (project.features || "").split(",").filter(Boolean);
  const challenges = (project.challenges || "").split(",").filter(Boolean);
  const techs = (project.tech_stack || "").split(",").filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          <Link to="/projects" className="text-sm text-muted hover:text-accent">← All projects</Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {techs.map((t) => (
                <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-surfaceAlt text-muted">{t.trim()}</span>
              ))}
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">{project.title}</h1>
            <p className="text-muted text-lg leading-relaxed mb-8">{project.tagline}</p>

            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-accent/25 to-accent2/25 flex items-center justify-center mb-10 border border-border min-h-52">
              {project.image_url ? <img src={project.image_url} alt={`${project.title} project screenshot`} className="w-full max-h-[520px] object-contain" /> : <span className="font-display text-6xl font-semibold text-text/70 py-20">{project.title.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>}
            </div>

            {screenshots.length > 0 && <section className="mb-10" aria-label="Project screenshot gallery">
              <h2 className="font-display text-2xl font-semibold mb-4">Project screenshots</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{screenshots.map((img, index) => <button key={img.id} type="button" onClick={() => setSelectedScreenshot(index)} className="text-left overflow-hidden rounded-xl border border-border bg-surface hover:border-accent transition-colors">
                <img src={img.image_url} alt={img.caption || `${project.title} screenshot ${index + 1}`} loading="lazy" className="w-full h-44 sm:h-52 object-contain" />
                {img.caption && <p className="text-sm text-muted px-3 py-2">{img.caption}</p>}
              </button>)}</div>
              {selectedScreenshot !== null && <div role="dialog" aria-modal="true" aria-label="Project screenshot preview" className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setSelectedScreenshot(null)}>
                <button type="button" className="self-end text-white text-lg mb-3" onClick={() => setSelectedScreenshot(null)}>Close ✕</button>
                <img src={screenshots[selectedScreenshot].image_url} alt={screenshots[selectedScreenshot].caption || "Project screenshot enlarged"} className="max-w-full max-h-[75vh] object-contain" onClick={e => e.stopPropagation()} />
                <div className="flex gap-6 items-center mt-4 text-white"><button type="button" onClick={e => { e.stopPropagation(); setSelectedScreenshot((selectedScreenshot - 1 + screenshots.length) % screenshots.length); }}>← Previous</button><span>{selectedScreenshot + 1} / {screenshots.length}</span><button type="button" onClick={e => { e.stopPropagation(); setSelectedScreenshot((selectedScreenshot + 1) % screenshots.length); }}>Next →</button></div>
              </div>}
            </section>}
            <div className="grid sm:grid-cols-2 gap-6 mb-10 pb-10 border-b border-border">
              {project.role && (
                <div><p className="text-xs uppercase tracking-wider text-muted mb-1">Role</p><p className="font-medium">{project.role}</p></div>
              )}
              {project.duration && (
                <div><p className="text-xs uppercase tracking-wider text-muted mb-1">Duration</p><p className="font-medium">{project.duration}</p></div>
              )}
            </div>

            <h2 className="font-display text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted leading-relaxed mb-10 whitespace-pre-line">{project.long_description || project.description || project.tagline}</p>

            {features.length > 0 && (
              <>
                <h2 className="font-display text-2xl font-semibold mb-4">Key features</h2>
                <ul className="space-y-3 mb-10">
                  {features.map((f) => (
                    <li key={f} className="flex gap-3 text-muted leading-relaxed"><span className="text-accent mt-1">•</span>{f.trim()}</li>
                  ))}
                </ul>
              </>
            )}

            {challenges.length > 0 && (
              <>
                <h2 className="font-display text-2xl font-semibold mb-4">Challenges &amp; learnings</h2>
                <ul className="space-y-3 mb-10">
                  {challenges.map((c) => (
                    <li key={c} className="flex gap-3 text-muted leading-relaxed"><span className="text-accent2 mt-1">•</span>{c.trim()}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full gradient-bg text-[#14181c] text-sm font-semibold hover:opacity-90 transition-opacity">
                  View source →
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-border text-sm font-medium hover:border-accent transition-colors">
                  Live demo →
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
