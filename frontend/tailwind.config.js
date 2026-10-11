/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0A1128',
        card: '#101A36',
        raised: '#15213F',
        border: '#223059',
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          muted: '#1D4ED8',
        },
        teal: {
          DEFAULT: '#14D9C0',
          hover: '#0EB8A3',
          muted: '#0F766E',
        },
        green: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          muted: '#15803D',
        },
        red: {
          DEFAULT: '#F5586B',
          hover: '#E11D48',
          muted: '#BE123C',
        },
        amber: {
          DEFAULT: '#F5B84B',
          hover: '#D97706',
          muted: '#B45309',
        },
      },
      borderRadius: {
        card: '16px',
        control: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        body: ['14px', '20px'],
        page: ['22px', '28px'],
      },
    },
  },
  plugins: [],
};
