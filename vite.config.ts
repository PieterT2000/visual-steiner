/// <reference types="vitest" />
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    svgrPlugin({
      svgrOptions: {
        exportType: "default",
      },
    }),
    react(),
  ],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    setupFiles: ["./tests/support/setupVitest.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  base: "/",
});
