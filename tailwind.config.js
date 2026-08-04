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
          DEFAULT: '#0B0F1A',
          soft: '#111827',
          rim: '#1C2333',
        },
        parchment: '#F4EFE3',
        gold: {
          DEFAULT: '#C9A24B',
          bright: '#E4C878',
          dim: '#8A7333',
        },
        rose: {
          DEFAULT: '#C4536B',
          bright: '#E07890',
        },
        slate: {
          mist: '#8B93A7',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        urdu: ['var(--font-urdu)', 'serif'],
        devanagari: ['var(--font-devanagari)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'ink-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,162,75,0.12), transparent), linear-gradient(180deg, #0B0F1A 0%, #0E1420 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(201,162,75,0.15)',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translateY(-10%) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(20px)', opacity: '0' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        drift: 'drift 14s linear infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
