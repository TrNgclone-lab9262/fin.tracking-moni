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
        background: "#F6F8FB",
        foreground: "#172B4D",
        navy: {
          DEFAULT: "#172B4D",
          dark: "#0F172A",
          card: "#1E3A8A",
          light: "#1E40AF",
        },
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3978F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        fintech: {
          income: "#158566",
          expense: "#D94F65",
          warning: "#B7791F",
          canvas: "#F6F8FB",
          surface: "#FFFFFF",
          border: "#DCE4EE",
          borderSubtle: "#E9EEF5",
        },
      },
      borderRadius: {
        btn: "0.375rem",   // 6px (rounded-md)
        input: "0.5rem",   // 8px (rounded-lg)
        card: "0.75rem",   // 12px (rounded-xl)
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 16px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
