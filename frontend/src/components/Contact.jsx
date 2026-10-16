import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.sendMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="section-num">06.</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">contact</h2>
          <span className="flex-1 h-px bg-border" />
        </div>
        <p className="text-muted mb-10">
          Have a project, internship opportunity, or just want to talk cybersecurity? Send a
          message below and I'll get back to you.
        </p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div aria-hidden="true" className="absolute opacity-0 pointer-events-none" style={{left:"-9999px"}}><label>Website<input tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={handleChange}/></label></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="px-6 py-3 rounded-full gradient-bg text-[#14181c] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send message →"}
          </button>

          {status === "sent" && (
            <p className="text-accent2 text-sm pt-2">Message received — I'll get back to you soon.</p>
          )}
          {status === "error" && <p className="text-red-400 text-sm pt-2">{errorMsg}</p>}
        </motion.form>
      </div>
    </section>
  );
}
