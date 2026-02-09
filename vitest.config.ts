import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Hledá testy v src i ve všech tvých očíslovaných vrstvách
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "01_REALITY/**/*.{test,spec}.{ts,tsx}",
      "02_DIGITAL_TWIN/**/*.{test,spec}.{ts,tsx}",
      "03_AI_LOGIC/**/*.{test,spec}.{ts,tsx}",
      "04_USER_INTERFACE/**/*.{test,spec}.{ts,tsx}",
      "05_INFRASTRUCTURE/**/*.{test,spec}.{ts,tsx}",
      "06_SHARED/**/*.{test,spec}.{ts,tsx}"
    ],
  },
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
});
