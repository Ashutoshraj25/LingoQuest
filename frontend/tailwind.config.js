/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          "green-dark": "#46A302",
          blue: "#1CB0F6",
          "blue-dark": "#1899D6",
          purple: "#CE82FF",
          "purple-dark": "#AF6CD9",
          orange: "#FF9600",
          "orange-dark": "#E28400",
          yellow: "#FFC800",
          "yellow-dark": "#E5B200",
          red: "#FF4B4B",
          "red-dark": "#EA2B2B",
          gray: "#E5E5E5",
          "gray-dark": "#AFAFAF",
          card: "#FFFFFF",
          "card-dark": "#18262F",
          bg: "#FFFFFF",
          "bg-dark": "#131F24",
          text: "#4B4B4B",
          "text-dark": "#F1F5F9",
        },
      },
      boxShadow: {
        "duo-sm": "0 2px 0 0 rgba(0,0,0,0.15)",
        "duo": "0 4px 0 0 rgba(0,0,0,0.2)",
        "duo-lg": "0 6px 0 0 rgba(0,0,0,0.25)",
        "duo-green": "0 4px 0 0 #46A302",
        "duo-blue": "0 4px 0 0 #1899D6",
        "duo-purple": "0 4px 0 0 #AF6CD9",
        "duo-red": "0 4px 0 0 #EA2B2B",
        "duo-yellow": "0 4px 0 0 #E5B200",
        "duo-gray": "0 4px 0 0 #AFAFAF",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
