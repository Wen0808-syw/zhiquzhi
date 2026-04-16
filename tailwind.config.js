/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f7b77d',
          400: '#f39347',
          500: '#f07824',
          600: '#e35f18',
          700: '#bf4814',
          800: '#973a17',
          900: '#793216',
          950: '#411608',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        knitting: {
          cream: '#FFF8F0',
          warm: '#F5E6D3',
          coral: '#FF6B6B',
          peach: '#FFAB91',
          sage: '#A8D5BA',
          lavender: '#C5A3FF',
          sky: '#87CEEB',
          gold: '#FFD700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
