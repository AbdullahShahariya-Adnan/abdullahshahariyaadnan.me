import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import FeaturedProjectGrid from "./FeaturedProjectGrid.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { api.getProjects().then(data => setProjects(Array.isArray(data) ? data : [])).catch(() => setProjects([])); }, []);
  return (
    <section id="projects" className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-24 bg-[#162235] text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 max-w-full -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex rounded-full bg-violet-500/15 text-violet-300 px-4 py-1 text-xs font-semibold mb-3">Portfolio</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">Featured <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Projects</span></h2>
          <p className="mt-4 text-[#aebaca] text-sm sm:text-base max-w-xl mx-auto">A collection of my work showcasing practical skills, creativity and technical experience.</p>
        </div>
        <FeaturedProjectGrid projects={projects} limit={6} />
        <div className="text-center mt-12"><Link to="/projects" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-pink-500 px-7 py-3.5 font-semibold text-sm text-white hover:brightness-110 transition">View All Projects <span className="ml-3">→</span></Link></div>
      </div>
    </section>
  );
}
