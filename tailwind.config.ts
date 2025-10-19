import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",      // include if you have any legacy pages
    "./content/**/*.{md,mdx}",           // include if you render MD/MDX
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f7ff",
          100: "#e9edff",
          200: "#cfd9ff",
          300: "#a9baff",
          400: "#7c93ff",
          500: "#5d76ff",
          600: "#4a5fe6",
          700: "#3a4bbc",
          800: "#303e99",
          900: "#2a377d",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)",
      },
      // You can keep 'xl2' if you use it; Tailwind’s built-in is '2xl'.
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [typography],
};

export default config;