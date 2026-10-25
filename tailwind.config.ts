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
        // Core palette: deep ink, warm ivory, and a muted brass accent
        ink: {
          DEFAULT: "#0f1b2d",
          900: "#0a1220",
          800: "#0f1b2d",
          700: "#1c2a40",
          600: "#2d3d56",
          500: "#4a5a72",
        },
        ivory: {
          DEFAULT: "#f7f4ee",
          50: "#fcfbf8",
          100: "#f7f4ee",
          200: "#efe9de",
        },
        brass: {
          DEFAULT: "#b08d57",
          50: "#f8f3ea",
          100: "#efe4d0",
          400: "#c4a575",
          500: "#b08d57",
          600: "#957444",
          700: "#795d36",
        },
        line: "#e6e0d4",
        muted: "#6b7280",
        // Legacy aliases, mapped onto the new palette
        estate: {
          primary: "#0f1b2d",
          secondary: "#3f7d5c",
          accent: "#b08d57",
          dark: "#0f1b2d",
          light: "#f7f4ee",
          gray: "#6b7280",
        },
        luxury: {
          gold: "#b08d57",
          dark: "#0f1b2d",
          light: "#f7f4ee",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,27,45,0.04), 0 8px 24px -12px rgba(15,27,45,0.12)",
        lift: "0 2px 4px rgba(15,27,45,0.04), 0 24px 48px -16px rgba(15,27,45,0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
