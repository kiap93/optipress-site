/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      colors: {
        editorial: {
          bg: '#F8F7F4',
          black: '#1A1A1A',
          border: '#E5E4E0',
          ad: {
            bg: '#F0EEE9',
            border: '#D1CEC7',
          }
        }
      },
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [],
}
