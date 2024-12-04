/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      gridTemplateColumns: {
        // Custom grid for 14 columns
        14: "repeat(14, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
