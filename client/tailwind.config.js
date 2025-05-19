module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure all relevant files are included
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0A0A0A',
        'primary-brown': '#3D1E0F',
        'primary-purple': '#634AFF',
        'primary-gray': '#6B7280',
        'primary-gold': '#CCBA78',
        'light-gray-1': '#E8E8E8',
        'light-gray-2': '#F0F0F0',
        'light-gray-3': '#F5F5F5',
      },
      fontFamily: {
        'special-elite': ['"Special Elite"', 'cursive'],
        'island-moments': ['"Island Moments"', 'cursive'],
        'covered-by-your-grace': ['"Covered By Your Grace"', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};