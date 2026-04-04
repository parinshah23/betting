/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Trendy Blue Monochromatic
        primary: {
          50: '#e8fafd',
          100: '#c5f1f9',
          200: '#8de0f2',
          300: '#3ACBE8',  // Light Cyan
          400: '#1CA3DE',  // Sky Blue
          500: '#0D85D8',  // Mid Blue (Primary Action)
          600: '#0160C9',  // Deep Blue
          700: '#0041C7',  // Dark Indigo
          800: '#003099',
          900: '#001f6b',
          950: '#000000',  // Pure Black (Main Background)
        },
        // Accent - lighter cyan for highlights
        accent: {
          50: '#e8fafd',
          100: '#c5f1f9',
          200: '#8de0f2',
          300: '#3ACBE8',
          400: '#1CA3DE',
          500: '#0D85D8',
          600: '#0160C9',
          700: '#0041C7',
          800: '#003099',
          900: '#001f6b',
        },
        // Success green
        success: {
          50: '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Danger/Error
        danger: {
          500: '#f43f5e',
          600: '#e11d48',
        },
        // Warning
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #000000 0%, #0041C7 50%, #0160C9 100%)',
        'gradient-hero': 'radial-gradient(circle at top right, #0041C7 0%, #000000 60%)',
        'gradient-cta': 'linear-gradient(135deg, #0D85D8 0%, #0160C9 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      },
      boxShadow: {
        'premium': '0 20px 40px -10px rgba(2, 6, 23, 0.5)',
        'glow-blue': '0 0 20px rgba(13, 133, 216, 0.5)',
        'glow-cyan': '0 0 20px rgba(58, 203, 232, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
}
