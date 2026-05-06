/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ytdark: "#0f0f0f",
        ytgray: "#272727",
        ythover: "#3f3f3f",
        ytred: "#ff0000",
      },
    },
  },
  plugins: [],
};
