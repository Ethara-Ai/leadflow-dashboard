import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for DOM testing
    environment: "jsdom",

    // Setup files to run before each test file
    setupFiles: ["./src/test/setup.js"],

    // Global test APIs (describe, it, expect, etc.)
    globals: true,

    // Include patterns for test files
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],

    // Exclude patterns
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.test.{js,jsx}",
        "src/**/*.spec.{js,jsx}",
        "src/main.jsx",
        "src/index.css",
      ],
      thresholds: {
        statements: 20,
        branches: 15,
        functions: 20,
        lines: 20,
      },
    },

    // Reporter configuration
    reporters: ["verbose"],

    // Test timeout
    testTimeout: 10000,

    // Retry failed tests
    retry: 1,

    // CSS handling
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },

  // Path aliases matching vite.config.js
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
