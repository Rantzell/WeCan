import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // sage/green brand carried from WeCan, tuned for a premium OS feel
        sage: {
          50: "#f2f5f0",
          100: "#e2e9dd",
          200: "#c4d3ba",
          300: "#a9bdb2",
          400: "#8aa590",
          500: "#6d8a74",
          600: "#556e5c",
          700: "#43574a",
          800: "#35443a",
          900: "#28332c",
          950: "#161d19",
        },
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        fg: "hsl(var(--fg))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        "accent-soft": "hsl(var(--accent-soft))",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--border)), 0 8px 40px -12px hsl(var(--accent) / 0.35)",
        soft: "0 4px 24px -8px rgba(0,0,0,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
