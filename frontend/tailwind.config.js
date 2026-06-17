/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary: YInMn Blue (#31487A) ────────────────
        primary: {
          DEFAULT: '#31487A',
          50:  '#EBF0F8',
          100: '#C8D6EC',
          200: '#9DB8DC',
          300: '#7299CC',
          400: '#4D7BBB',
          500: '#31487A',
          600: '#263863',
          700: '#1C2A4C',
          800: '#131C35',
          900: '#090E1E',
        },
        // ── Accent: Jordy Blue (#8FB3E2) ─────────────────
        accent: {
          DEFAULT: '#8FB3E2',
          50:  '#F0F5FB',
          100: '#D9E8F5',
          200: '#BDD4EE',
          300: '#A2C0E8',
          400: '#8FB3E2',
          500: '#6B98D3',
          600: '#4A7DC4',
        },
        // ── Surface: Oxford / Space Cadet darks ──────────
        surface: {
          DEFAULT: '#192338',   // Oxford Blue — page bg
          50:  '#1E2E4F',       // Space Cadet — panels
          100: '#253660',       // borders / dividers
          200: '#2E4070',       // muted elements
          300: '#4A6494',       // placeholder text
          400: '#7090B8',       // secondary text
          500: '#A0B8D4',       // body text
          600: '#C4D3E8',       // headings
          700: '#D9E1F1',       // near-lavender
          800: '#EEF2FA',       // white-ish surfaces
        },
        // ── Lavender: #D9E1F1 as named token ─────────────
        cream: {
          DEFAULT: '#D9E1F1',
          dark:    '#B8C6E0',
          light:   '#EEF2FA',
        },
        // ── Utility ──────────────────────────────────────
        success: '#4A7DBB',
        warning: '#8FB3E2',
        danger:  '#C25F5F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up':    'slideUp 0.6s ease-out',
        'fade-in':     'fadeIn 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'card':       '0 4px 20px -2px rgba(25, 35, 56, 0.4)',
        'card-hover': '0 20px 40px -8px rgba(49, 72, 122, 0.45)',
        'glow':       '0 0 40px rgba(49, 72, 122, 0.25)',
      },
    },
  },
  plugins: [],
}

