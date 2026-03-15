/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        vp: {
          // Vibepulse primary palette
          purple: {
            50:  '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065',
          },
          pink: {
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          },
          emerald: {
            400: '#34d399',
            500: '#10b981',
          },
          amber: {
            400: '#fbbf24',
            500: '#f59e0b',
          },
          red: {
            400: '#f87171',
            500: '#ef4444',
          },
          // Background shades
          bg: {
            base:    '#0a0a0f',
            surface: '#0f0f1a',
            elevated:'#141428',
            card:    '#1a1a30',
            border:  '#2a2a4a',
          },
          // Text
          text: {
            primary:   '#f1f5f9',
            secondary: '#94a3b8',
            muted:     '#64748b',
          },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #7c3aed44' },
          '100%': { boxShadow: '0 0 20px #7c3aed88, 0 0 40px #7c3aed22' },
        },
      },
      boxShadow: {
        'vp-sm':  '0 1px 3px rgba(124, 58, 237, 0.1)',
        'vp-md':  '0 4px 12px rgba(124, 58, 237, 0.15)',
        'vp-lg':  '0 8px 24px rgba(124, 58, 237, 0.2)',
        'vp-glow':'0 0 20px rgba(124, 58, 237, 0.3)',
      },
    },
  },
  plugins: [],
};
