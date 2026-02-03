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
        // Premium Blue - Main brand color
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Vibrant blue
          600: '#2563eb',  // Primary blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Premium Red - Accent/CTA color
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Vibrant red
          600: '#dc2626',  // Action red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
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
          500: '#ef4444',
          600: '#dc2626',
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
        'gradient-premium': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1e40af 0%, #2563eb 40%, #dc2626 100%)',
        'gradient-cta': 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(37, 99, 235, 0.3)',
        'premium-red': '0 10px 40px -10px rgba(220, 38, 38, 0.3)',
      },
    },
  },
  plugins: [],
}
