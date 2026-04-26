/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm cream/parchment palette
        warm: {
          50: '#fdf9f3',   // page background - very soft cream
          100: '#faf2e6',  // card background - warm parchment
          200: '#f0e3cd',  // soft accent
          300: '#e2cfa8',  // borders
          400: '#c9aa6f',  // muted gold
          500: '#a8854a',  // accent gold
          600: '#7d5f30',  // dark gold
          700: '#5a4322',
          800: '#3d2e17',
          900: '#26190b',
        },
        ink: {
          900: '#1f1a14',  // body text - warm dark brown
          700: '#4a3f30',
          500: '#7a6b56',
          300: '#a89c87',
        },
        primary: {
          50: '#fdf4ed',
          100: '#fae3cf',
          500: '#d97706',  // burnt orange
          600: '#b45309',
          700: '#92400e',
          900: '#451a03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
