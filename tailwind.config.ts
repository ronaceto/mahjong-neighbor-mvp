import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
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
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
