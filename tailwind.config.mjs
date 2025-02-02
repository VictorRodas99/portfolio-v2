import defaultTailwindColors from 'tailwindcss/colors'

/* As of Tailwind CSS v2.2, certain colors has been renamed  */
const deprecatedColors = [
  'lightBlue',
  'warmGray',
  'coolGray',
  'blueGray',
  'trueGray'
]

for (const color of deprecatedColors) {
  delete defaultTailwindColors[color]
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },

      // dark mode
      'soft-white': '#e8ecfb',
      midnight: '#040718',
      primary: '#5020cb',
      secondary: '#2c168c',
      accent: '#6232df',

      // light mode
      'soft-dark': '#040816',
      noon: '#e9ecfb',
      'light-primary': '#142480',
      'light-secondary': '#8872e9',
      'light-accent': '#5020cb',

      ...defaultTailwindColors
    }
  },
  plugins: []
}
