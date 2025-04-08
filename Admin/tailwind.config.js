const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Adjust paths as per your project
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".slide-in": {
          "@apply animate-slideIn": {},
        },
      });
    }),
  ],
};
