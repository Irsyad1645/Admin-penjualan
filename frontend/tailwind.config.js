/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        kelontong: {
          primary: '#2563EB',
          'primary-content': '#ffffff',
          secondary: '#10B981',
          accent: '#2563EB',
          neutral: '#1E293B',
          'base-100': '#F8FAFC',
          'base-200': '#F5F7FA',
          'base-300': '#E5E7EB',
          info: '#2563EB',
          success: '#10B981',
          warning: '#f59e0b',
          error: '#EF4444',
          'neutral-content': '#ffffff',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
