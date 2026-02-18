/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(0, 96, 88)',        // Verde petróleo
        secondary: 'rgb(0, 188, 212)',    // Celeste turquesa (botones)
        accent: 'rgb(0, 188, 212)',       // Celeste turquesa
        petroleum: 'rgb(0, 96, 88)',      // Verde petróleo
        'petroleum-dark': 'rgb(0, 76, 70)', // Verde petróleo oscuro
        'gray-custom': 'rgb(55, 71, 79)', // Texto normal
        'bg-light': 'rgb(245, 247, 247)', // Fondo claro opcional
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
