import { content } from "../content.js";

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} Md Abdullah Shahariya Adnan. All rights reserved.</p>
        <div className="flex gap-6">
          <a href={content.contact.github} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
          <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">LinkedIn</a>
          <a href={`mailto:${content.contact.email}`} className="hover:text-accent">Email</a>
        </div>
      </div>
    </footer>
  );
}
