/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F5F0E8',
        'secondary-bg': '#2E4B38',
        'surface-dark': '#101010',
        'surface-light': '#FFFFFF',
        'text-primary': '#111111',
        'text-secondary': '#555555',
        'accent-amber': '#F4B400',
        'accent-orange': '#F97316',
        'border-cream': '#DDCFAF',
        'warm-gray': '#B8B8B0',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Canela', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(56px, 9vw, 160px)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        display: ['clamp(48px, 7vw, 96px)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        h1: ['clamp(40px, 5.5vw, 72px)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        h2: ['clamp(32px, 4vw, 54px)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h3: ['clamp(26px, 3vw, 42px)', { lineHeight: '1.1' }],
        h4: ['clamp(22px, 2.2vw, 32px)', { lineHeight: '1.15' }],
        body: ['18px', { lineHeight: '1.6' }],
        small: ['15px', { lineHeight: '1.5' }],
        caption: ['13px', { lineHeight: '1.4' }],
      },
      spacing: {
        section: '160px',
      },
      maxWidth: {
        content: '1240px',
        container: '1440px',
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '20px',
        lg: '32px',
        xl: '48px',
      },
      boxShadow: {
        small: '0 8px 24px rgba(0,0,0,0.06)',
        medium: '0 20px 50px rgba(0,0,0,0.08)',
        large: '0 50px 100px rgba(0,0,0,0.12)',
        glow: '0 0 60px rgba(244,180,0,0.25)',
      },
      backdropBlur: {
        glass: '20px',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        spinSlow: 'spinSlow 18s linear infinite',
        blink: 'blink 4s infinite',
        wave: 'wave 2.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
