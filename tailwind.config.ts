// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // if you use /src
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B1E6D",
        secondary: "#ADAFEB",
        accent: "#D2CE4B",
        neutral: "#FFFFFF",
      },
    },
  },
  plugins: [],
};

export default config;
