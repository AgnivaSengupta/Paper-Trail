import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
      headers: {
        // This allows the Google popup to "talk" back to your React app
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "unsafe-none", 
      },
    },
})
