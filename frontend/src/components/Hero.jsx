
import { motion, useReducedMotion } from "framer-motion";
import { content } from "../content.js";
import { useSiteSettings } from "../lib/useSiteSettings.js";

const SOCIALS = [
  {
    label: "GitHub",
    href: content.contact.github,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1.15-.02-2.09-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.98 10.98 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: content.contact.linkedin,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${content.contact.email}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 6.2L19.8 6H4.2Zm15.8 1.9-7.36 5.86a1 1 0 0 1-1.28 0L4 7.9v10.6h16V7.9Z" />
      </svg>
    ),
  },
];

export default function Hero() {
  const { hero } = content;
  const site = useSiteSettings();
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = (delay = 0) => ({
    initial: false,
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : {
          duration: 0.45,
          delay,
          ease: "easeOut",
        },
  });

  const renderSocials = (mobile = false) => (
    <div
      className={`flex items-center gap-3 ${
        mobile ? "mt-5" : "mt-7"
      }`}
    >
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target={
            social.label === "Email" ? undefined : "_blank"
          }
          rel={
            social.label === "Email"
              ? undefined
              : "noopener noreferrer"
          }
          aria-label={social.label}
          className={`${
            mobile ? "w-10 h-10" : "w-11 h-11"
          } rounded-full border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative overflow-hidden"
    >
      {/* Desktop and tablet */}
      <div className="hidden md:block">
        <div
          aria-hidden="true"
          className="absolute right-0 top-24 bottom-0 w-[52%] pointer-events-none"
        >
          <img
            src={hero.photo}
            alt=""
            className="hero-photo w-full h-full object-cover"
            style={{ objectPosition: "center 15%" }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-44 pb-32 grid grid-cols-[1.1fr_1fr] gap-14 items-center">
          <div>
            <motion.div
              {...fadeIn(0)}
              className="flex items-center gap-3 mb-5"
            >
              <span className="text-sm font-semibold tracking-widest text-accent uppercase">
                {hero.greeting}
              </span>
              <span className="w-8 h-px bg-accent" />
            </motion.div>

            {site.hero_title && (
              <p className="text-accent font-semibold mb-3">
                {site.hero_title}
              </p>
            )}

            <motion.h1
              {...fadeIn(0.05)}
              className="font-display text-6xl font-extrabold leading-[1.08] tracking-tight"
            >
              {hero.firstName}
              <br />
              <span className="text-accent">
                {hero.lastName}
              </span>
            </motion.h1>

            <motion.p
              {...fadeIn(0.1)}
              className="mt-5 text-base font-medium tracking-wide text-muted uppercase"
            >
              {site.hero_subtitle || hero.tagline}
            </motion.p>

            <motion.div
              {...fadeIn(0.15)}
              className="mt-7"
            >
              <a
                href="#contact"
                className="text-text font-semibold underline underline-offset-4 decoration-2 decoration-accent hover:text-accent transition-colors"
              >
                {hero.ctaLabel}
              </a>
            </motion.div>

            <motion.div {...fadeIn(0.2)}>
              {renderSocials()}
            </motion.div>
          </div>

          <div aria-hidden="true" />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <img
          src={hero.photo}
          alt=""
          className="absolute top-0 left-0 w-full h-[72svh] object-cover"
          style={{ objectPosition: "85% 35%" }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 36%, var(--bg) 75%, var(--bg) 100%)",
          }}
        />

        <div className="relative z-10 px-4 sm:px-6 pb-8 sm:pb-10 pt-28">
          <motion.div
            {...fadeIn(0)}
            className="flex items-center gap-3 mb-3"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">
              {hero.greeting}
            </span>
            <span className="w-6 h-px bg-accent" />
          </motion.div>

          <motion.h1
            {...fadeIn(0.05)}
            className="font-display text-[clamp(2rem,9vw,3rem)] font-extrabold leading-[1.12] tracking-tight break-words"
          >
            {hero.firstName}
            <br />
            <span className="text-accent">
              {hero.lastName}
            </span>
          </motion.h1>

          <motion.p
            {...fadeIn(0.1)}
            className="mt-4 text-xs font-medium tracking-wide text-muted uppercase"
          >
            {site.hero_subtitle || hero.tagline}
          </motion.p>

          <motion.div
            {...fadeIn(0.15)}
            className="mt-5"
          >
            <a
              href="#contact"
              className="text-text text-sm font-semibold underline underline-offset-4 decoration-2 decoration-accent hover:text-accent transition-colors"
            >
              {hero.ctaLabel}
            </a>
          </motion.div>

          <motion.div {...fadeIn(0.2)}>
            {renderSocials(true)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
