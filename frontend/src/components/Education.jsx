import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function Education() {
  const [items,setItems] = useState([]);
  const [projects,setProjects] = useState([]);
  useEffect(()=>{
    api.getEducation().then(d=>{if(Array.isArray(d)) setItems(d);}).catch(()=>{});
    api.getProjects().then(d=>{if(Array.isArray(d)) setProjects(d);}).catch(()=>{});
  },[]);
  return <section id="education" className="px-4 sm:px-6 py-24 bg-surface/40">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-4"><span className="section-num">05.</span><h2 className="font-display text-3xl md:text-4xl font-extrabold">my journey</h2><span className="flex-1 h-px bg-border" /></div>
      <p className="text-muted mb-10">Education and hands-on project milestones. Professional experience will be added as it develops.</p>
      <div className="relative border-l-2 border-accent/40 ml-3 sm:ml-5 space-y-8 pb-2">
        {items.map(item=><article key={`education-${item.id}`} className="relative pl-7 sm:pl-9"><span className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-accent ring-4 ring-surface" /><div className="rounded-2xl border border-border bg-surface p-5 sm:p-6"><span className="text-accent2 text-xs uppercase font-semibold tracking-wider">Education · {item.start_year || ""}{item.end_year ? ` – ${item.end_year}` : ""}</span><h3 className="font-display text-lg sm:text-xl font-semibold mt-2">{item.degree}</h3><p className="text-muted mt-1">{item.institution}</p>{item.description && <p className="text-muted text-sm mt-3 leading-relaxed">{item.description}</p>}</div></article>)}
        {projects.slice(0,3).map(item=><article key={`project-${item.id}`} className="relative pl-7 sm:pl-9"><span className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-accent2 ring-4 ring-surface" /><div className="rounded-2xl border border-border bg-surface p-5 sm:p-6"><span className="text-accent2 text-xs uppercase font-semibold tracking-wider">Project milestone</span><h3 className="font-display text-lg sm:text-xl font-semibold mt-2">{item.title}</h3><p className="text-muted text-sm mt-2">{item.tagline || item.description}</p><Link to={`/projects/${item.id}`} className="text-accent inline-block mt-4 text-sm font-semibold hover:underline">Read project case study →</Link></div></article>)}
        {!items.length && !projects.length && <p className="pl-8 text-muted">Education and project milestones will appear here when added.</p>}
      </div>
    </div>
  </section>;
}
