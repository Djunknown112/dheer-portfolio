import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own cacheable chunks so the
        // initial bundle stays small and returning visitors hit the cache.
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-router")) return "router";
          if (id.includes("react-dom") || id.includes("react/") || id.endsWith("/react")) return "react";
          if (id.includes("lucide-react")) return "icons";
        },
      },
    },
  },
}));
