/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Flowbite primary color system (Sky Blue)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        // Sophisticated 4-font system (purposeful rule-breaking)
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'], // Geometric precision
        body: ['Crimson Pro', 'Georgia', 'serif'], // Humanist warmth
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'], // Technical clarity
        accent: ['Cormorant Garamond', 'Georgia', 'serif'], // Artistic flourish

        // Tailwind defaults (body takes precedence)
        sans: ['Crimson Pro', 'Georgia', 'serif'], // Default to body font
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
