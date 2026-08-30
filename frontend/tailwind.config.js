/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#07090E',
          900: '#0B0F17',
          850: '#101726',
          800: '#162035',
          700: '#202E4C',
          600: '#33466D',
          500: '#4F6B9E',
          accent: '#00E5FF',
          green: '#00FF66',
          yellow: '#FFB800',
          red: '#FF334B',
          panel: '#111827',
          card: '#151E32',
          border: '#1F2D48'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 102, 0.35)',
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.35)',
        'glow-amber': '0 0 20px rgba(255, 184, 0, 0.35)',
        'glow-red': '0 0 20px rgba(255, 51, 75, 0.4)',
        'tactile': '0 6px 0 rgba(0, 0, 0, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.6)'
      }
    },
  },
  plugins: [],
}
