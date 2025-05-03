/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          100: '#1E1E2E', // Darkest background
          200: '#2A2A3C', // Card background
          300: '#3A3A4C', // Lighter background elements
          400: '#4A4A5C', // Borders and dividers
          500: '#5A5A6C', // Disabled text
        },
        accent: {
          purple: '#9D4EDD',
          blue: '#6A64F1',
          cyan: '#38BDF8',
          pink: '#EC4899',
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(124, 58, 237, 0.15)',
        'glow-lg': '0 0 25px rgba(124, 58, 237, 0.2)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
