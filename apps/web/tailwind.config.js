/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          border: "#E2E8F0",
        },
        muted: "#64748B",
        foreground: "#0F172A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "800" }],
        "hero-md": ["2.5rem", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "800" }],
        "hero-xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        section: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "800" }],
        "section-md": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "800" }],
        "section-xl": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "card-title": ["1rem", { lineHeight: "1.4", fontWeight: "700" }],
        "card-title-md": ["1.375rem", { lineHeight: "1.35", fontWeight: "700" }],
      },
      borderRadius: {
        card: "24px",
        btn: "16px",
        input: "12px",
        glass: "24px",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 16px -2px rgb(0 0 0 / 0.06)",
        elevated: "0 8px 30px -4px rgb(0 0 0 / 0.1), 0 4px 12px -2px rgb(0 0 0 / 0.05)",
        glow: "0 0 40px -8px rgb(37 99 235 / 0.35)",
        glass: "0 24px 64px rgba(15, 23, 42, 0.09)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      maxWidth: {
        narrow: "48rem",
        content: "64rem",
        wide: "80rem",
        ultra: "120rem",
      },
    },
  },
  plugins: [],
};
