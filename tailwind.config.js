/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsla(2, 51%, 11%, 1)',
        secondary: 'hsla(2, 51%, 11%, 0.4)',
        border: 'hsla(2, 51%, 11%, 0.1)',
        default: 'hsla(36, 100%, 99%, 1)',
      },
      fontFamily: {
        heading: 'Roboto Condensed',
        body: 'Bellefair',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
  ],
};
