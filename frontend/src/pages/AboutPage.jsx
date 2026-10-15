import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Skills from "../components/Skills.jsx";
import Education from "../components/Education.jsx";
import { content } from "../content.js";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h1 className="font-display text-4xl md:text-5xl font-extrabold">about</h1>
              <span className="flex-1 h-px bg-border" />
            </div>

            <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
              <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                <div className="w-full aspect-square rounded-3xl overflow-hidden bg-accent/20 border border-border">
                  <img src={content.hero.photo} alt="Portrait" className="w-full h-full object-cover" />
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-2"><span className="text-muted">Location</span><span className="font-medium">Pécs, Hungary</span></div>
                  <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-2"><span className="text-muted">Studying</span><span className="font-medium">Computer Science</span></div>
                  <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-2"><span className="text-muted">Graduating</span><span className="font-medium">2027</span></div>
                  <div className="flex flex-wrap justify-between gap-2"><span className="text-muted">Focus</span><span className="font-medium">Cybersecurity</span></div>
                </div>
              </motion.div>

              <div className="space-y-6 text-muted text-lg leading-relaxed">
                <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                  I'm a Computer Science student at the University of Pécs, Hungary, with a strong
                  interest in cybersecurity, software development, and cloud technologies. Most of
                  my time outside class goes into building full-stack web applications and getting
                  more comfortable with Linux systems and networking.
                </motion.p>
                <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                  On the development side, I work mainly with Angular and NestJS on top of SQL
                  databases, building applications end to end — from schema design through the API
                  layer to a finished, usable interface. I like projects where the data model
                  actually matters, which is part of why personal finance and expense-tracking
                  tools have been a recurring theme in my work.
                </motion.p>
                <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                  On the security side, I'm building up fundamentals: Linux administration,
                  networking, and basic penetration testing, largely through hands-on practice on
                  TryHackMe alongside coursework. My goal is to move into cybersecurity and secure
                  software engineering — ideally somewhere that lets me keep building things and
                  keep taking them apart to understand how they break.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        <Skills />
        <Education />
      </main>
      <Footer />
    </>
  );
}
