/** @type {import('tailwindcss').Config} */

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 0px 25px rgba(0,0,0,0.1)", // Кастомная тень
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"], // Шрифт
      },
    },
  },
  plugins: [],
}