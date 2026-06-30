/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        combat: {
          black: "#0b0b0f",
          panel: "#15151c",
          line: "#2b2b36",
          red: "#e11d2f",
          white: "#f7f7f8",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(225,29,47,0.25), 0 18px 40px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
