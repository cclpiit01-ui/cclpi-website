/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // DITO MO ILALAGAY ANG FONT
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Ito ang magiging default font ng buong site
        heading: ['Montserrat', 'sans-serif'], // Optional: para sa mga titles
      },
      colors: {
          brand: {
          primary: "#013F99",
          secondary: "#4CB1E9",
          accent: "#F3CF47",
          surface: "#f6fbfe",
        },
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        slideInRight: "slideInRight 0.3s ease-out forwards",
        slideOutRight: "slideOutRight 0.3s ease-out forwards",
        slideInRightSlow: "slideInRight 0.8s ease-out forwards",
        scroll: "scroll 25s linear infinite",
      },
    },
  },
  plugins: [],
};