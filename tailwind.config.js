/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#020617',
        },
      },
      boxShadow: {
        neon: '0 20px 45px -20px rgba(45, 212, 191, 0.45)',
      },
    },
  },
  plugins: [],
}
