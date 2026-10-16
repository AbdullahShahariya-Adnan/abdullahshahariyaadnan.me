import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

const SYMBOLS = {LANG:"⌘",WEB:"◈",DB:"▤",TOOLS:"⚙",SEC:"◇"};
const LABELS = { LANG: "Programming", WEB: "Frontend & Backend", DB: "Databases", TOOLS: "Tools", SEC: "Cybersecurity" };
const FALLBACK = [
  {category:"LANG",name:"Python"},{category:"LANG",name:"JavaScript"},{category:"LANG",name:"SQL"},
  {category:"WEB",name:"Angular"},{category:"WEB",name:"NestJS"},{category:"WEB",name:"Node.js"},
  {category:"DB",name:"MySQL"},{category:"TOOLS",name:"Git"},{category:"TOOLS",name:"GitHub"}
];
export default function Skills() {
  const [skills,setSkills] = useState(FALLBACK);
  const [intro,setIntro]=useState("");
  const [projects,setProjects] = useState([]);
  const [filter,setFilter] = useState("ALL");
  const [selected,setSelected] = useState("");
  useEffect(() => {
    api.getSettings().then(s=>setIntro(s.skills_intro||"")).catch(()=>{});
    api.getSkills().then(data => { if (Array.isArray(data) && data.length) setSkills(data); }).catch(()=>{});
    api.getProjects().then(data => { if (Array.isArray(data)) setProjects(data); }).catch(()=>{});
  },[]);
  const categories = useMemo(() => [...new Set(skills.map(s => s.category))], [skills]);
  const visible = skills.filter(s => filter === "ALL" || s.category === filter);
  const matches = projects.filter(p => String(p.tech_stack || "").split(",").some(t => t.trim().toLowerCase() === selected.toLowerCase()));
  return <section id="skills" className="px-4 sm:px-6 py-24">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-4"><span className="section-num">04.</span><h2 className="font-display text-3xl md:text-4xl font-extrabold">tech stack</h2><span className="flex-1 h-px bg-border" /></div>
      <p className="text-muted mb-7">{intro || "Explore the tools I use. Select a skill to find projects built with it."}</p>
      <div className="flex flex-wrap gap-2 mb-8" aria-label="Filter skills">
        {["ALL",...categories].map(cat => <button key={cat} type="button" onClick={() => {setFilter(cat);setSelected("");}} aria-pressed={filter===cat} className={`px-4 py-2 rounded-full text-sm border transition-colors ${filter===cat ? "border-accent bg-accent/15 text-text" : "border-border text-muted hover:text-text hover:border-accent/50"}`}>{cat==="ALL" ? "All skills" : LABELS[cat] || cat}</button>)}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(visible.reduce((a,s)=>{(a[s.category] ||= []).push(s.name);return a;},{})).map(([cat,names]) => <div key={cat} className="rounded-2xl border border-border bg-surface p-5 min-w-0 hover:border-accent/60 hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-5"><span aria-hidden="true" className="w-11 h-11 rounded-xl bg-accent/10 text-accent grid place-items-center text-2xl">{SYMBOLS[cat]||"✦"}</span><div><h3 className="text-sm font-bold">{LABELS[cat] || cat}</h3><p className="text-muted text-xs">{names.length} technologies</p></div></div>
          <div className="flex flex-wrap gap-2">{names.map((name,i) => <button key={`${name}-${i}`} type="button" aria-pressed={selected===name} onClick={() => setSelected(selected===name ? "" : name)} className={`rounded-full px-3 py-2 text-sm transition-colors ${selected===name ? "bg-accent text-[#14181c]" : "bg-surfaceAlt text-text hover:ring-1 hover:ring-accent"}`}>{name}</button>)}</div>
        </div>)}
      </div>
      {selected && <div className="mt-7 p-5 rounded-2xl border border-border bg-surface" aria-live="polite">
        <div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">Projects using {selected}</h3><button onClick={()=>setSelected("")} className="text-muted hover:text-text text-sm">Clear ×</button></div>
        {matches.length ? <div className="flex flex-wrap gap-3 mt-4">{matches.map(p=><Link key={p.id} to={`/projects/${p.id}`} className="rounded-lg border border-border px-4 py-2 text-accent hover:border-accent">{p.title} →</Link>)}</div> : <p className="text-muted text-sm mt-3">No published project currently lists this skill.</p>}
      </div>}
    </div>
  </section>;
}
