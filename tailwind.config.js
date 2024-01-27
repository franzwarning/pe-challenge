/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./app/**/*.{html,html.erb,js,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['OpenSans-Light', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [

  ],
};