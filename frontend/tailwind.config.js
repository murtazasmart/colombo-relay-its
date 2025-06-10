/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#006837', // Green
          '50': '#E8F5F0',
          '100': '#CCECDE',
          '200': '#99D9BC',
          '300': '#66C69A',
          '400': '#33B378',
          '500': '#009F54',
          '600': '#008643',
          '700': '#006837',
          '800': '#004C29',
          '900': '#00331C',
        },
        'secondary': {
          DEFAULT: '#D4AF37', // Gold
          '50': '#FBF8EB',
          '100': '#F7F1D7',
          '200': '#EFE3B0',
          '300': '#E7D588',
          '400': '#DFC761',
          '500': '#D4AF37',
          '600': '#B18F2D',
          '700': '#8E7223',
          '800': '#6B551A',
          '900': '#483911',
        },
      }
    },
  },
  plugins: [],
};
