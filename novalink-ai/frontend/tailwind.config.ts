import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00d9ff',
        'neon-purple': '#b300ff',
        'neon-pink': '#ff006e',
        'neon-cyan': '#00ffff',
        'dark-bg': '#0a0e27',
        'dark-secondary': '#151b2f',
        'dark-tertiary': '#1e2749',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00d9ff 0%, #b300ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #151b2f 100%)',
      },
      backdropBlur: {
        sm: '4px',
        md: '12px',
        lg: '24px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
          },
          '50%': {
            opacity: '0.5',
            boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)',
          },
        },
        'glow': {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5), 0 0 20px rgba(179, 0, 255, 0.3)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(179, 0, 255, 0.6)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
