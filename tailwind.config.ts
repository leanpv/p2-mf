import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#fafafa',
        accent: '#c9a96e',
        'accent-light': '#e8d5b0',
        muted: '#8a8573',
        'muted-bg': '#f5f3f0',
        foreground: '#171717',
        background: '#ffffff',
        border: '#e5e2dd',
        error: '#b91c1c',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: 'clamp(2.5rem, 6vw, 5rem)',
        headline: 'clamp(1.75rem, 4vw, 3rem)',
        title: 'clamp(1.25rem, 2.5vw, 2rem)',
        body: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
        caption: 'clamp(0.75rem, 1vw, 0.875rem)',
      },
      letterSpacing: {
        display: '-0.03em',
        headline: '-0.02em',
      },
      lineHeight: {
        display: '1.05',
        headline: '1.15',
        body: '1.65',
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
