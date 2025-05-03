/** @type {import('tailwindcss').Config} */

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 0px 15px rgba(0,0,0,0.05)", 
        gradient: '0 4px 6px rgba(183, 78, 0, 0.5), 0 1px 3px rgba(217, 99, 29, 0.5), 0 0px 8px rgba(243, 156, 18, 0.5), 0 0px 10px rgba(241, 196, 15, 0.5)',

      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"], 
      },
      spacing: {
        '72': '18rem', 
      },
    },
  },
  plugins: [],
}