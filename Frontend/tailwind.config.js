/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', 
          hover: '#1D4ED8',   
          light: '#DBEAFE',  
        },
        secondary: '#6B7280', 
        success: '#10B981',  
        danger: '#EF4444',   
        surface: '#F9FAFB',   
        border: '#D1D5DB',   
      },
      
      spacing: {
        'input': '0.5rem',   
        'card': '1.5rem',    
      },
      
      fontSize: {
        'heading': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }], 
        'label': ['0.875rem', { fontWeight: '600' }], 
      }
    },
  },
  plugins: [],
}