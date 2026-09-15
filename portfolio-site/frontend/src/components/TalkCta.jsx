import { motion } from "framer-motion";
import { content } from "../content.js";

export default function TalkCta() {
  return (
    <section className="px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto rounded-[2.5rem] gradient-bg p-10 md:p-16 text-center relative overflow-hidden"
      >
        <p className="text-[#14181c]/70 font-medium text-sm uppercase tracking-widest mb-3">
          Got an opportunity in mind?
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#14181c] mb-8 max-w-2xl mx-auto leading-tight">
          Let's talk about your next project
        </h2>
        <a
          href="#contact"
          className="inline-block px-7 py-3.5 rounded-full bg-[#14181c] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Contact {content.hero.name}
        </a>
      </motion.div>
    </section>
  );
}
