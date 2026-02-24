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
                background: '#000000',
                surface: 'rgba(255, 255, 255, 0.05)',
                primary: '#0cebeb', // Cian vibrante
                secondary: '#20e3b2', // Verde eléctrico
                accent: '#29ffc6'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
