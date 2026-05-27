import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        gold: "#d4a853",
        "gold-dim": "#7a5f28",
        bg: "#080806",
        surface: "#0f0e0b",
        border: "#201e18",
        hot: "#34d399",
        warm: "#fbbf24",
        cold: "#818cf8",
      },
      fontWeight: {
        "300": "300",
        "700": "700",
      },
      animation: {
        scan: "scan 2s linear infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
        "count-ring": "countRing 1s ease-out forwards",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(500%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
