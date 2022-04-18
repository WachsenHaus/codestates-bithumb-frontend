module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      bmjua: ['bmjua'],
    },
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
