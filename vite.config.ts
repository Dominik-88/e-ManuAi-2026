import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Standardní alias pro složku src
      "@": path.resolve(__dirname, "./src"),
      
      // Tvoje nová 9-vrstvá architektura
      "@reality": path.resolve(__dirname, "./01_REALITY"),
      "@digital-twin": path.resolve(__dirname, "./02_DIGITAL_TWIN"),
      "@ai": path.resolve(__dirname, "./03_AI_LOGIC"),
      "@ui": path.resolve(__dirname, "./04_USER_INTERFACE"),
      "@infrastructure": path.resolve(__dirname, "./05_INFRASTRUCTURE"),
      "@shared": path.resolve(__dirname, "./06_SHARED"),
    },
  },
}));
