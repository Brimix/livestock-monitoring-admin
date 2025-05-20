/** @type {import('tailwindcss').Config} */
module.exports = {
  debug: true,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './dist/index.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    gap: true,
  },
};
