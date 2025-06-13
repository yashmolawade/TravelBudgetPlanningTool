/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb",
        background: "#ffffff",
        foreground: "#111827",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        dark: {
          border: "#374151",
          background: "#111827",
          foreground: "#f9fafb",
          primary: {
            50: "#1e3a8a",
            100: "#1e40af",
            500: "#3b82f6",
            600: "#60a5fa",
            700: "#93c5fd",
          },
        },
      },
    },
  },
  plugins: [],
};
