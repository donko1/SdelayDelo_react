const path = require("path");

module.exports = {
  content: [path.resolve(__dirname, "../src/**/*.{js,jsx,ts,tsx}")],
  safelist: [
    "bg-black-review",
    "bg-white-review",
    "text-black-review",
    "text-white-review",
    "outline-black",
    "outline-white",
    "hover:bg-white",
  ],

  theme: {
    extend: {
      colors: {
        "black-review": "#101010",
        "white-review": "#f3f3f3",
      },
    },
  },
  plugins: [],
};
