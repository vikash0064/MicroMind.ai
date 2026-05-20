/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Geist', 'system-ui', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'geist': ['Geist', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'surface': '#131313',
        'surface-dim': '#131313',
        'surface-bright': '#3a3939',
        'surface-container': '#201f1f',
        'surface-container-low': '#1c1b1b',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353534',
        'surface-container-lowest': '#0e0e0e',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#bbcabf',
        'outline': '#86948a',
        'outline-variant': '#3c4a42',
        'primary': '#4edea3',
        'on-primary': '#003824',
        'primary-container': '#10b981',
        'on-primary-container': '#00422b',
        'secondary': '#adc6ff',
        'on-secondary': '#002e6a',
        'secondary-container': '#0566d9',
        'tertiary': '#d0bcff',
        'on-tertiary': '#3c0091',
        'tertiary-container': '#b090ff',
        'error': '#ffb4ab',
        'error-container': '#93000a',
        'inverse-surface': '#e5e2e1',
        'inverse-primary': '#006c49',
        'dark': {
          900: '#000000',
          800: '#0e0e0e',
          700: '#131313',
          600: '#1c1b1b',
          500: '#201f1f',
        }
      },
      fontSize: {
        'display-lg': ['72px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-lg': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '500' }],
        'code-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'margin-mobile': '20px',
        'margin-desktop': '64px',
        'gutter': '24px',
        'container-max': '1440px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-1': 'float1 7s ease-in-out infinite',
        'float-2': 'float2 8s ease-in-out infinite',
        'float-3': 'float3 9s ease-in-out infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'scan-fast': 'scanFast 2s linear infinite',
        'shimmer': 'shimmer 4s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'pulse-slow': 'pulseSlow 12s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        float1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-10px, -20px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(15px, -15px)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-5px, -25px)' },
        },
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
        scanFast: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(78, 222, 163, 0.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 15px rgba(78, 222, 163, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(78, 222, 163, 0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        '20': '20px',
      },
    },
  },
  plugins: [],
}
