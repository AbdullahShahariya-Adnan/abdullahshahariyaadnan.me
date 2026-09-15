import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { content } from "../content.js";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Work" },
  { href: "/#gallery", label: "Gallery" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg/90 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <a href="/" className="font-display text-lg">
          <span className="font-bold">{content.logo.bold}</span>
          <span className="font-medium text-muted">{content.logo.light}</span>
        </a>
        <ul className="hidden md:flex items-center gap-10 text-sm text-text">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-accent transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="text-xs px-3 py-2 rounded-full border border-border text-muted hover:text-accent hover:border-accent transition-colors"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <a
            href={content.contact.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-accent transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="text-text">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1.15-.02-2.09-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.98 10.98 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-block text-xs font-semibold tracking-wide px-5 py-2.5 rounded-full gradient-bg text-[#14181c] hover:opacity-90 transition-opacity"
          >
            LET'S TALK
          </a>
        </div>
      </nav>
    </header>
  );
}
