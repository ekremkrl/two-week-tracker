/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          emerald: '#10b981',
          teal: '#14b8a6',
          indigo: '#6366f1',
        },
      },
      boxShadow: {
        neu: '8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,0.6)',
        neuDark: '8px 8px 16px rgba(0,0,0,0.5), -8px -8px 16px rgba(255,255,255,0.02)'
      },
    },
  },
  plugins: [],
};




