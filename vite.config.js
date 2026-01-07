import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, path.resolve(__dirname), "");

  return {
    plugins: [react(), tailwindcss()],

    // Path aliases for cleaner imports
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@assets": path.resolve(__dirname, "./src/assets"),
      },
    },

    // Development server configuration
    server: {
      port: parseInt(env.PORT) || 5173,
      strictPort: false,
      open: true,
      cors: true,
    },

    // Preview server configuration (for production preview)
    preview: {
      port: parseInt(env.PORT) || 4173,
      strictPort: false,
    },

    // Build configuration
    build: {
      // Suppress chunk size warning (default is 500kb)
      chunkSizeWarningLimit: 800,

      // Output directory
      outDir: env.BUILD_DIR || "dist",

      // Source maps for production (controlled via env)
      sourcemap: env.GENERATE_SOURCEMAP === "true",

      // Minification
      minify: mode === "production" ? "esbuild" : false,

      // Target modern browsers for smaller bundle
      target: "es2020",

      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            "react-vendor": ["react", "react-dom"],
            "chart-vendor": ["recharts"],
            "animation-vendor": ["framer-motion"],
            "icons-vendor": ["lucide-react"],
          },
        },
      },
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || "1.0.0"),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Environment variable prefix (default is VITE_)
    envPrefix: "VITE_",
  };
});
