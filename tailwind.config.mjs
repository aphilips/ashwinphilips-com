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
        // Section-based color system using CSS variables
        // These change dynamically based on data-section attribute
        section: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
          glow: 'var(--accent-glow)',
        },
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          'gradient-start': 'var(--bg-gradient-start)',
          'gradient-end': 'var(--bg-gradient-end)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        // Static brand colors for elements that don't change
        brand: {
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
          },
          purple: {
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
          },
          blue: {
            500: '#3b82f6',
            600: '#2563eb',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
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
