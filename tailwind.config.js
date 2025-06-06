const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Override default 'sans'
      },
    },
    color: {
      itemHover: "#757575",
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
});
