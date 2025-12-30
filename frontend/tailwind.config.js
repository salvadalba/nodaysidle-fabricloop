/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          50: '#e6f7f1',
          100: '#ccefe3',
          200: '#99dfc7',
          300: '#66cfab',
          400: '#33bf8f',
          500: 'rgb(var(--color-primary))',
          600: '#28a378',
          700: '#208760',
          800: '#186b48',
          900: '#104f30',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          50: '#edf4fe',
          100: '#dbe9fd',
          200: '#b7d3fb',
          300: '#93bdf9',
          400: '#6fa7f7',
          500: 'rgb(var(--color-secondary))',
          600: '#1d5ec4',
          700: '#174b9d',
          800: '#113876',
          900: '#0b254f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
