import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// Vite kör i ESM-läge, 'node:path' är säkrast för Node 18+ i ESM
import path from "node:path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Viktigt för GitHub Pages: basen MÅSTE matcha repo-namnet
  // Din site kommer ligga på: https://adelsebraoui-web.github.io/geo/
  base: mode === "production" ? "/geo/" : "/",

  server: {
    host: "::", // Tillåt externa anslutningar (IPv6/IPv4 via ::)
    port: 8080,
    hmr: {
      overlay: false, // Visa inte overlay-fel i dev (valfritt)
    },
  },

  plugins: [
    react(),
    // Kör bara taggern i utvecklingsläge
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
}));
