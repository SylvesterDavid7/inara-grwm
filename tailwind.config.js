/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // surface gray
        input: 'var(--color-input)', // soft gray
        ring: 'var(--color-ring)', // deep trustworthy blue
        background: 'var(--color-background)', // pure white with subtle warmth
        foreground: 'var(--color-foreground)', // near-black with blue undertones
        primary: {
          DEFAULT: 'var(--color-primary)', // deep trustworthy blue
          foreground: 'var(--color-primary-foreground)', // pure white with subtle warmth
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // warm skin-toned neutral
          foreground: 'var(--color-secondary-foreground)', // near-black with blue undertones
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // clear red for critical issues
          foreground: 'var(--color-destructive-foreground)', // pure white with subtle warmth
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // soft gray for subtle elevation
          foreground: 'var(--color-muted-foreground)', // medium gray for supporting information
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // sage green for natural wellness
          foreground: 'var(--color-accent-foreground)', // pure white with subtle warmth
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // pure white with subtle warmth
          foreground: 'var(--color-popover-foreground)', // near-black with blue undertones
        },
        card: {
          DEFAULT: 'var(--color-card)', // pure white with subtle warmth
          foreground: 'var(--color-card-foreground)', // near-black with blue undertones
        },
        success: {
          DEFAULT: 'var(--color-success)', // clinical green for positive results
          foreground: 'var(--color-success-foreground)', // pure white with subtle warmth
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber for caution
          foreground: 'var(--color-warning-foreground)', // pure white with subtle warmth
        },
        error: {
          DEFAULT: 'var(--color-error)', // clear red for critical issues
          foreground: 'var(--color-error-foreground)', // pure white with subtle warmth
        },
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Source Sans 3', 'sans-serif'],
        'caption': ['IBM Plex Sans', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-normal': '400',
        'body-medium': '500',
        'caption-normal': '400',
        'data-normal': '400',
      },
      borderRadius: {
        'clinical': '8px',
        'clinical-sm': '4px',
      },
      boxShadow: {
        'clinical': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'clinical-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'clinical-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        'clinical': '200ms',
        'clinical-slow': '300ms',
      },
      transitionTimingFunction: {
        'clinical': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        'navigation': '1000',
        'secondary-nav': '900',
        'modal': '1100',
        'tooltip': '1200',
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}