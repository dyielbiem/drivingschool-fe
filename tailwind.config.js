/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        "custom-font": ["DM Sans", "Arial", "Helvetica", "sans-serif"]
      },
      colors: {
        "custom-blue-darker": "#213D58",
        "custom-blue-dark": "#284867",
        "custom-blue-base": "#346BA0",
        "custom-blue-light": "#2693FF",
        "custom-green-light": "#CAF0AD",
        "custom-green-base": "#41721C",
        "custom-gray-dark": "#828282",
        "custom-gray-base": "#E3E3E3",
        "custom-white-darker": "#D7D7D7",
        "custom-white-dark": "#F6F7FB",
        "custom-white-base": "#F0F0F0",
        "custom-red": "#AE3737"
      }
    }
  },
  plugins: []
};
