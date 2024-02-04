/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{html,html.erb,js,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['OpenSans-Light', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'page-background': '#F4F4F1'
      },
      flex: {},
      maxWidth: {
        page: 1096,
        paragraph: 620
      }
    }
  },
  plugins: []
}
