/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FAF8F3',
          100: '#F4F1E9',
          200: '#E9E4D6',
          300: '#DDD6C2',
          900: '#1A1814',
        },
        gdg: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
          dark: '#111111',
          charcoal: '#222222',
          muted: '#666666',
        },
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #111111',
        'brutal': '4px 4px 0px #111111',
        'brutal-lg': '6px 6px 0px #111111',
        'brutal-blue': '4px 4px 0px #4285F4',
        'brutal-red': '4px 4px 0px #EA4335',
        'brutal-green': '4px 4px 0px #34A853',
        'brutal-yellow': '4px 4px 0px #FBBC04',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
