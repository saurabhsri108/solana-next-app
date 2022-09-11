/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsla(2, 51%, 11%, 1)',
        secondary: 'hsla(2, 51%, 11%, 0.4)',
        default: 'hsla(36, 100%, 99%, 1)',
      },
      fontFamily: {
        heading: 'Roboto Condensed',
        body: 'Bellefair',
      },
    },
  },
  plugins: [],
};
