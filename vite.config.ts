/// <reference types="vitest" />
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import checker from "vite-plugin-checker";

const plugins = [
  svgrPlugin({
    svgrOptions: {
      exportType: "default",
    },
  }),
  react(),
];

if (process.env.NODE_ENV === "development") {
  plugins.push(
    checker({
      typescript: true,
    })
  );
}
export default defineConfig({
  plugins,
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    setupFiles: ["./tests/support/setupVitest.ts"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/components/ui/**"],
      reporter: ["text", "html"],
      enabled: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  base: "/",
});
