import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service worker próprio (src/sw.ts) para receber notificações push;
      // o plugin só injeta nele a lista de arquivos do build.
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "MusicWork - A rede dos músicos",
        short_name: "MusicWork",
        description:
          "Plataforma para músicos se conectarem, compartilharem posts e trocarem serviços musicais.",
        theme_color: "#0f0f0f",
        background_color: "#0f0f0f",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
