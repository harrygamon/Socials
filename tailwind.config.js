/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jelly: {
          50: '#fff0f6',
          100: '#ffe0ec',
          200: '#ffb3c6',
          300: '#ff80a6',
          400: '#ff4d85',
          500: '#ff1a64', // primary
          600: '#e60058',
          700: '#b30045',
          800: '#800032',
          900: '#4d001f',
        },
        primary: {
          DEFAULT: '#ff1a64',
          light: '#ff80a6',
          dark: '#b30045',
        },
        accent: {
          DEFAULT: '#ff4d85',
          light: '#ffb3c6',
          dark: '#800032',
        },
        border: '#e5e7eb', // Tailwind gray-200
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        jelly: '0 4px 24px 0 rgba(255, 26, 100, 0.15)',
      },
      backgroundImage: {
        'jelly-gradient': 'linear-gradient(90deg, #ff80a6 0%, #ff1a64 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
} 