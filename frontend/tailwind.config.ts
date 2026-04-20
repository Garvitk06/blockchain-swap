import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          blue: "#015ad1",
          gold: "#f5a623",
          black: "#000000",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
