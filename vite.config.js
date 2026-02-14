import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: false,
      includeAssets: [
        "love-app-icon-192x192.png",
        "love-app-icon-512x512.png",
        "love-app-icon.svg",
      ],
      workbox: {
        navigateFallback: "/index.html",
      },
    }),
  ],
});
