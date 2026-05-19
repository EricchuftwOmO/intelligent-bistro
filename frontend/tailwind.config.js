/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx}", "./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bistro: { bg: '#1a1a2e', card: '#16213e', accent: '#e94560', gold: '#f5a623', text: '#eaeaea' }
      }
    },
  },
  plugins: [],
};
