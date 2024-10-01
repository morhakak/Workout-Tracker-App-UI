/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        tablet: "640px",
        gridBpLaptop: "1362px",
        gridBpMobile: "708px",
        desktop: "1280px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
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
