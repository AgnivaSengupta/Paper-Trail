import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Pre-buffer POST/PUT/PATCH bodies so the Vite proxy can forward them.
    // Without this, http-proxy may receive an already-consumed stream.
    {
      name: "proxy-body-buffer",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (["POST", "PUT", "PATCH"].includes(req.method ?? "")) {
            const chunks: Buffer[] = [];
            req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            req.on("end", () => {
              (req as any)._body = Buffer.concat(chunks);
              next();
            });
          } else {
            next();
          }
        });
      },
    },
  ],
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
    proxy: {
      // Forward all /api requests to the backend — avoids CORS entirely in local dev
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            // Use the pre-buffered body from the plugin middleware above.
            const rawBody: Buffer | undefined = (req as any)._body;
            if (rawBody && rawBody.length > 0) {
              proxyReq.setHeader("Content-Length", rawBody.length);
              proxyReq.write(rawBody);
            }
          });
        },
      },
    },
  },
})
