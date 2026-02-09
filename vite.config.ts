import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // KRITICKÉ: Base path pro GitHub Pages
  base: mode === 'production' ? '/e-ManuAi-2026/' : '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@reality": path.resolve(__dirname, "./01_REALITY"),
      "@digital-twin": path.resolve(__dirname, "./02_DIGITAL_TWIN"),
      "@ai": path.resolve(__dirname, "./03_AI_LOGIC"),
      "@ui": path.resolve(__dirname, "./04_USER_INTERFACE"),
      "@infrastructure": path.resolve(__dirname, "./05_INFRASTRUCTURE"),
      "@shared": path.resolve(__dirname, "./06_SHARED"),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        }
      }
    }
  }
}));
