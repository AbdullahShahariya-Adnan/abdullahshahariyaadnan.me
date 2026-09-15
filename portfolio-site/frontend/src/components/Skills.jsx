import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api.js";

const CATEGORY_LABELS = {
  LANG: "Languages",
  WEB: "Web Development",
  DB: "Databases",
  TOOLS: "Tools & Technologies",
  SEC: "Cybersecurity",
};

const FALLBACK = [
  { category: "LANG", name: "Python" }, { category: "LANG", name: "JavaScript" },
  { category: "LANG", name: "Java" }, { category: "LANG", name: "C++" }, { category: "LANG", name: "SQL" },
  { category: "WEB", name: "Angular" }, { category: "WEB", name: "NestJS" }, { category: "WEB", name: "Node.js" },
  { category: "WEB", name: "HTML5" }, { category: "WEB", name: "CSS3" }, { category: "WEB", name: "REST APIs" },
  { category: "DB", name: "MySQL" }, { category: "DB", name: "SQL Server" },
  { category: "TOOLS", name: "Git" }, { category: "TOOLS", name: "GitHub" }, { category: "TOOLS", name: "Linux" },
  { category: "TOOLS", name: "VS Code" }, { category: "TOOLS", name: "DBeaver" }, { category: "TOOLS", name: "XAMPP" },
  { category: "SEC", name: "Linux Fundamentals" }, { category: "SEC", name: "Network Fundamentals" },
  { category: "SEC", name: "Basic Penetration Testing" }, { category: "SEC", name: "TryHackMe" },
];

export default function Skills() {
  const [skills, setSkills] = useState(FALLBACK);

  useEffect(() => {
    api
      .getSkills()
      .then((data) => data.length && setSkills(data))
      .catch(() => setSkills(FALLBACK));
  }, []);

  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.name);
    return acc;
  }, {});

  return (
    <section id="skills" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <span className="section-num">04.</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">skills</h2>
          <span className="flex-1 h-px bg-border" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([cat, names], i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-border bg-surface"
            >
              <p className="text-xs uppercase tracking-wider text-accent2 font-medium mb-3">
                {CATEGORY_LABELS[cat] || cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {names.map((n) => (
                  <span key={n} className="text-sm px-3 py-1.5 rounded-full bg-surfaceAlt text-text">
                    {n}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
