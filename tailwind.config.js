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
        lilac: '#C3A6FF',
        purple: '#7C3AED',
        teal: '#2DD4BF',
        coral: '#FF6B6B',
        midnight: '#1A2233',
        jet: '#111111',
        'jelly-100': '#F3E8FF', // light lilac
        'jelly-400': '#C084FC', // medium purple
        'jelly-500': '#A21CAF', // vibrant purple
        'jelly-700': '#86198F', // deep purple
        'jelly-900': '#2A1337', // near-black
        // Gradients can be created with from- and to- utilities
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
        'pill': '9999px',
      },
      boxShadow: {
        'neumorph': '0 4px 24px 0 rgba(60, 60, 90, 0.10), 0 1.5px 4px 0 rgba(60, 60, 90, 0.08)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
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
}; 