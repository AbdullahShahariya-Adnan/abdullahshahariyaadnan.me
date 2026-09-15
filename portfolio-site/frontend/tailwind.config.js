/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surfaceAlt: "var(--surface-alt)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        accent2: "var(--accent-2)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
