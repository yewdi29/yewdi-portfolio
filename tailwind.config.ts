import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        desk: "#111111",
        sheet: "#F4F4F2",
        ink: "#111111",
        mute: "#8A8A86",
        rule: "#E4E4E0",
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        meta: "0.14em",
      },
      fontSize: {
        meta: ["11px", { lineHeight: "1.4", letterSpacing: "0.14em" }],
        display: ["clamp(2.75rem, 7vw, 6.25rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        dossier: ["clamp(1.2rem, 2.15vw, 1.9rem)", { lineHeight: "1.35", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        sheet: "1.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
