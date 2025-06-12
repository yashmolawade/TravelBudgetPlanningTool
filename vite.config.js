import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "firebase/app": "firebase/app",
      "firebase/auth": "firebase/auth",
      "firebase/firestore": "firebase/firestore",
      "firebase/database": "firebase/database",
      "firebase/analytics": "firebase/analytics",
    },
  },
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/database",
      "firebase/analytics",
    ],
  },
});
