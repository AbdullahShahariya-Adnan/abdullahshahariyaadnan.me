import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FeaturedProjectGrid from "../components/FeaturedProjectGrid.jsx";
import { api } from "../lib/api.js";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { api.getProjects().then(data => setProjects(Array.isArray(data) ? data : [])).catch(() => setProjects([])); }, []);
  return <><Navbar /><main className="min-h-screen relative overflow-hidden px-4 sm:px-6 pt-28 sm:pt-36 pb-24 bg-[#162235] text-white">
    <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] max-w-full h-96 bg-sky-500/10 rounded-full blur-3xl" />
    <div className="relative max-w-6xl mx-auto">
      <div className="text-center mb-12"><span className="inline-block rounded-full bg-violet-500/15 text-violet-300 px-4 py-1 text-xs font-semibold mb-4">Portfolio</span>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Featured <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Projects</span></h1>
      <p className="text-[#aebaca] mt-4 text-sm sm:text-base max-w-xl mx-auto">A collection of my recent work showcasing creativity and technical expertise.</p></div>
      <FeaturedProjectGrid projects={projects} />
    </div>
  </main><Footer /></>;
}
