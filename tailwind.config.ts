import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0f1419",
          panel: "#1a2332",
          card: "#1e2a3d",
          hover: "#243349",
        },
        border: {
          DEFAULT: "#2d3a4f",
          strong: "#3d4d68",
        },
        accent: {
          DEFAULT: "#ff9900",
          hover: "#ffac33",
          muted: "#cc7a00",
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        text: {
          primary: "#e6edf3",
          secondary: "#b0bac6",
          muted: "#8b949e",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
