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
          base: "#0A0E13",
          panel: "#111823",
          card: "#151D29",
          hover: "#1A2431",
        },
        border: {
          DEFAULT: "#232D3C",
          strong: "#2E3B4E",
        },
        accent: {
          DEFAULT: "#7C8CF8",
          hover: "#97A4FA",
          muted: "#5E6FE0",
        },
        success: "#2FD9C4",
        danger: "#F0596B",
        warning: "#F5A93F",
        text: {
          primary: "#E9EEF4",
          secondary: "#94A2B5",
          muted: "#5D6C80",
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
