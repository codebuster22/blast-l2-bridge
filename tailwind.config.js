/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          transparent: "transparent",
          current: "currentColor",
          white: "#ffffff",
          dark: "#040303",
          stroke: "#282A3A",
          primary: "#735F32",
          highlight: "#fcfd07",
        },
      },
    },
  },
  plugins: [],
};
