/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./ui/**/*.html",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@flexilla/tailwind-plugin")
  ],
}

