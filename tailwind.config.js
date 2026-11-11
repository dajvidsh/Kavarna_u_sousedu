/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kavarna: {
          bg: '#FAF6F0',
          card: '#FFFFFF',
          border: '#ECE2D5',
          primary: '#533B2C',
          dark: '#3D271D',
          light: '#7A5B45',
          gold: '#C49764',
          muted: '#7F6B5E',
        },
      },
    },
  },
  plugins: [],
};
