/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neumorphic': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neumorphic-inset': 'inset 9px 9px 16px rgb(163,177,198,0.6), inset -9px -9px 16px rgba(255,255,255, 0.5)'
      }
    },
  },
  plugins: [],
};