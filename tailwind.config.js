/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color, #0b0f19)',
          secondary: 'var(--tg-theme-secondary-bg-color, #151c2e)',
          text: 'var(--tg-theme-text-color, #f8fafc)',
          hint: 'var(--tg-theme-hint-color, #94a3b8)',
          link: 'var(--tg-theme-link-color, #38bdf8)',
          button: 'var(--tg-theme-button-color, #2563eb)',
          'button-text': 'var(--tg-theme-button-text-color, #ffffff)',
        },
        brand: {
          spotify: '#1DB954',
          yandex: '#FFCC00',
          youtube: '#FF0000',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite alternate',
        'equalizer-2': 'equalizer 1.1s ease-in-out 0.2s infinite alternate',
        'equalizer-3': 'equalizer 0.7s ease-in-out 0.4s infinite alternate',
        'equalizer-4': 'equalizer 0.9s ease-in-out 0.1s infinite alternate',
      },
      keyframes: {
        equalizer: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        },
      },
    },
  },
  plugins: [],
};
