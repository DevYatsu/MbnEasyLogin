const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

const config = {
  plugins: [
    tailwindcss(), //Some plugins, like tailwindcss/nesting, need to run before Tailwind, tailwindcss(), //But others, like autoprefixer, need to run after, autoprefixer, autoprefixer],
    autoprefixer]
}

module.exports = config
