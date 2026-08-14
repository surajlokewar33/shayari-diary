/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0709',
          soft: '#140C11',
          deep: '#070406',
        },
        maroon: {
          DEFAULT: '#1A0C12',
          surface: '#1F0F17',
          elevated: '#28131E',
          wine: '#350F1B',
        },
        parchment: {
          DEFAULT: '#F7F2E7',
          cream: '#D8CEBD',
        },
        gold: {
          DEFAULT: '#D4AF37',
          amber: '#E8C568',
          subtle: 'rgba(212, 175, 55, 0.12)',
          dim: '#9E7D23',
        },
        rose: {
          DEFAULT: '#C24A60',
          bright: '#E26D85',
        },
        ash: {
          muted: '#9E8C84',
        },
      },
      fontFamily: {
        devanagari: ['var(--font-devanagari)', 'Georgia', 'Cambria', 'serif'],
        ui: ['var(--font-ui)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.22)',
        'card-hover': '0 18px 44px -8px rgba(0, 0, 0, 0.7), 0 0 24px -4px rgba(212, 175, 55, 0.18), 0 0 0 1px rgba(232, 197, 104, 0.5)',
        glow: '0 0 30px rgba(212, 175, 55, 0.22)',
        subtle: '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
