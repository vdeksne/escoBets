import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "hero-logo": {
          "0%": {
            opacity: "0",
            filter: "blur(6px)",
            transform: "translateY(0.5rem) scale(0.96)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateY(0) scale(1)",
          },
        },
        "hero-line": {
          "0%": {
            opacity: "0",
            filter: "blur(5px)",
            transform: "translateY(0.85rem)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateY(0)",
          },
        },
        "hero-cta": {
          "0%": {
            opacity: "0",
            filter: "blur(3px)",
            transform: "translateY(0.5rem) scale(0.98)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateY(0) scale(1)",
          },
        },
        "hero-glow": {
          "0%, 100%": {
            textShadow:
              "0 0 40px rgba(251, 254, 39, 0.5), 0 0 90px rgba(251, 254, 39, 0.18)",
          },
          "50%": {
            textShadow:
              "0 0 56px rgba(251, 254, 39, 0.75), 0 0 120px rgba(251, 254, 39, 0.32)",
          },
        },
        "admin-in": {
          "0%": { opacity: "0", transform: "translateY(0.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "hero-logo":
          "hero-logo 1.05s cubic-bezier(0.16, 1, 0.3, 1) both",
        "hero-line": "hero-line 0.95s cubic-bezier(0.16, 1, 0.3, 1) both",
        "hero-cta": "hero-cta 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "hero-glow": "hero-glow 3.2s ease-in-out infinite",
        "admin-in": "admin-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // EscoBets brand
        escobets: {
          yellow: "#DFFF00",
          black: "#000000",
          "gray-dark": "#1a1a1a",
          "gray-card": "#262626",
        },
      },
      fontFamily: {
        sans: ["Gotham", "system-ui", "sans-serif"],
        mono: ["Gotham", "monospace"],
        gotham: ["Gotham", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
