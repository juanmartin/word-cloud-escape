/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-zoom": "bounce-zoom 500ms infinite",
      },
      keyframes: {
        "bounce-zoom": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
  darkMode: true,
};
