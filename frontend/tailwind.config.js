/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We'll define our government-first color palette here
        navy: {
          50: '#f0f4f8',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#a2b4d6',
          400: '#788cbc',
          500: '#4e669a',
          600: '#3a4d78',
          700: '#2b3656',
          800: '#1f253d',
          900: '#151a2b',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
}
