/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f2137',
          700: '#162d4a',
          600: '#1e3a5f',
        },
        accent: {
          cyan: '#22d3ee',
          teal: '#14b8a6',
        }
      }
    },
  },
  plugins: [],
}
