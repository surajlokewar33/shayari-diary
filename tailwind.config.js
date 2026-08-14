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
          DEFAULT: '#0E080B',
          soft: '#160D12',
          deep: '#090507',
        },
        maroon: {
          DEFAULT: '#1F0A11',
          rich: '#2B0E17',
          wine: '#350F1B',
        },
        parchment: {
          DEFAULT: '#F7F2E7',
          cream: '#E6DAC4',
        },
        gold: {
          DEFAULT: '#D4AF37',
          amber: '#E8C568',
          dim: '#9E7D23',
        },
        rose: {
          DEFAULT: '#C24A60',
          bright: '#DF6880',
        },
        ash: {
          muted: '#9E8B83',
        },
      },
      fontFamily: {
        devanagari: ['var(--font-devanagari)', 'serif'],
        urdu: ['var(--font-urdu)', 'serif'],
        ui: ['var(--font-ui)', 'sans-serif'],
      },
      backgroundImage: {
        'ink-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.14), transparent), linear-gradient(180deg, #0E080B 0%, #170C12 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #1F0A11 0%, #0E080B 100%)',
      },
      boxShadow: {
        glow: '0 0 35px rgba(212,175,55,0.18)',
        journal: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.22)',
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
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        drift: 'drift 14s linear infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
