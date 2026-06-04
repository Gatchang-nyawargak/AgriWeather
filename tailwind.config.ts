/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        earth: {
          50: '#faf7f2',
          100: '#f0e9da',
          200: '#ddd0b8',
          300: '#c4ae8e',
          400: '#a98b68',
          500: '#8d7050',
          600: '#755c42',
          700: '#5e4837',
          800: '#4e3c2f',
          900: '#42332a',
        },
        sage: {
          50: '#f2f7f2',
          100: '#e0ecde',
          200: '#c2d9bf',
          300: '#96bf91',
          400: '#67a060',
          500: '#478440',
          600: '#356832',
          700: '#2b5329',
          800: '#244324',
          900: '#1e381e',
        },
        sky: {
          dawn: '#e8c49a',
          gold: '#d4943c',
          blue: '#5b8db8',
          deep: '#2c4a6e',
        }
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
