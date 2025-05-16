/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-brown': '#3D1E0F',
        'primary-gold': '#CCBA78',
        'primary-white': '#FFFFFF',
        'primary-purple': '#8B5CF6', // Added this color
      },
    },
  },
  plugins: [],
}