/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
       "fade-in": {
              "0%": {
                  opacity: 0
              },
              "100%": {
                  opacity: 1
              },
          },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
      },
      fontFamily: {
        dosis: ['Dosis', 'sans-serif'], // Add the Dosis font
      },

    },
  },
  plugins: [],
}