import { motion } from "framer-motion";
import { content } from "../content.js";

const SOCIALS = [
  {
    label: "GitHub",
    href: content.contact.github,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1.15-.02-2.09-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.98 10.98 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: content.contact.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${content.contact.email}`,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 6.2L19.8 6H4.2Zm15.8 1.9-7.36 5.86a1 1 0 0 1-1.28 0L4 7.9v10.6h16V7.9Z" />
      </svg>
    ),
  },
];

export default function Hero() {
  const { hero } = content;

  return (
    <section id="hero" className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
      {/* decorative background blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "var(--accent)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-10 right-0 w-[28rem] h-[28rem] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "var(--accent-2)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "var(--accent)" }}
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-14 items-center relative z-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-muted mb-2"
          >
            {hero.greeting}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight gradient-text"
          >
            {hero.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-lg md:text-xl text-muted max-w-lg leading-relaxed"
          >
            {hero.role}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <a
              href="#contact"
              className="px-6 py-3 rounded-full gradient-bg text-[#14181c] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {hero.ctaLabel}
            </a>

            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto"
        >
          <div className="absolute -inset-4 gradient-bg rounded-[2.25rem] opacity-25 blur-2xl" />
          <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-[2rem] overflow-hidden border border-border">
            <img src={hero.photo} alt="Portrait" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
