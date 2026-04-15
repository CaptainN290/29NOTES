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
        vault: {
          bg:        "#0B2A8A",
          bgDeep:    "#071E6B",
          bgDark:    "#061655",
          panel:     "#1340B0",
          panelAlt:  "#1850C8",
          border:    "#4A9EE8",
          borderFaint:"#2A6AC0",
          cyan:      "#5DDCF5",
          cyanDim:   "#3BBAD8",
          text:      "#D8EEFF",
          textDim:   "#7FB8E8",
          textFaint: "#4A7AB5",
          accent:    "#6EE7FF",
          glow:      "#3BB8F0",
          active:    "#2060D8",
          highlight: "#1D4FC4",
        },
      },
      fontFamily: {
        vault: ["VaultFont", "monospace"],
        body:  ["Nunito", "sans-serif"],
      },
      boxShadow: {
        panel:    "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(100,180,255,0.15)",
        active:   "0 0 20px rgba(93,220,245,0.35), 0 4px 16px rgba(0,0,0,0.4)",
        tab:      "2px 0 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(100,180,255,0.2)",
        inner:    "inset 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 2px rgba(0,0,0,0.2)",
        button:   "0 4px 0 rgba(0,0,0,0.35), 0 0 12px rgba(93,220,245,0.2)",
        buttonHover: "0 2px 0 rgba(0,0,0,0.35), 0 0 20px rgba(93,220,245,0.4)",
        glow:     "0 0 30px rgba(93,220,245,0.25)",
        noteCard: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(100,180,255,0.1)",
        noteHover:"0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(100,180,255,0.2), 0 0 12px rgba(93,220,245,0.15)",
      },
      borderRadius: {
        vault: "16px",
        vaultLg: "24px",
        vaultXl: "32px",
      },
      backdropBlur: {
        vault: "12px",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
          "25%": { opacity: "0.98" },
          "75%": { opacity: "0.96" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(93,220,245,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(93,220,245,0.6)" },
        },
      },
      animation: {
        flicker: "flicker 8s infinite",
        scanline: "scanline 6s linear infinite",
        blink: "blink 1.2s step-end infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
