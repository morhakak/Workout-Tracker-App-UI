/** @type {import('tailwindcss').Config} */
export default {
  // purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Set Roboto as the default sans font
      },
      keyframes: {
        bgAnimate: {
          "0%": { backgroundPosition: "50% 0" },
          "100%": { backgroundPosition: "-150% 0" },
        },
      },
      animation: {
        bgAnimate: "bgAnimate 1.2s linear infinite",
      },
      backgroundImage: {
        "placeholder-gradient":
          "linear-gradient(to right, #d6d7d8 0%, #e2e3e4 10%, #d6d7d8 20%, #d6d7d8 100%)",
      },
    },
  },
  plugins: [],
};
