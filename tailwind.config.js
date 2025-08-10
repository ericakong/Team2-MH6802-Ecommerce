// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0A2540', // main dark blue
          light: '#103255',   // hover/focus ring
          dark: '#061A30'     // darker hover
        }
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(16, 50, 85, 0.45)' // matches brand.light
      }
    }
  },
  plugins: []
}