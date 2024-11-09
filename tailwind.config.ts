import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1355f0",
        // primary: "#ffcc00",
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        "4xl": "0 35px 75px -20px rgba(0, 0, 0, 0.7)",
      },
      fontFamily: {
        SCDream: ["var(--font-SCDream)"],
      },
    },
  },
  plugins: [],
};
export default config;
