/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Defined in instruction 2.2 
      colors: {
        
        gray: {
          100: '#f3f4f6',
          300: '#d1d5db',
          700: '#374151',
        }
      }
    },
  },
  plugins: [],
}