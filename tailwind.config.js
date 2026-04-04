/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0f2540',
          mid: '#1e3a5f',
          light: '#2d5a8e',
        },
        orange: {
          DEFAULT: '#e8732a',
          light: '#f09050',
        },
        cream: '#f8f6f1',
      },
    },
  },
  plugins: [],
}
