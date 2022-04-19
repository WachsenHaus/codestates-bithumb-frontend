module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      bmjua: ['bmjua'],
    },
    extend: {
      animation: {
        up: 'up_Effect 0.2s',
        down: 'down_Effect 0.2s',
      },
      keyfraems: {
        up_Effect: {
          from: {
            opacity: 1,
            borderColor: 'red',
          },
          to: {
            opacity: 0,
            borderColor: 'white',
          },
        },
        down_Effect: {
          '0%': {
            opacity: 1,
            borderColor: 'blue',
          },
          '100%': {
            opacity: 0,
            borderColor: 'white',
          },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
