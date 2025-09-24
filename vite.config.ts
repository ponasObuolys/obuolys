import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    // React Fast Refresh įjungtas pagal nutylėjimą Vite aplinkoje
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
    // Extract CSS into separate chunks for better caching
    devSourcemap: mode === "development",
  },
  build: {
    // Target modern browsers for smaller bundle sizes
    target: ["es2020", "chrome80", "firefox78", "safari14", "edge79"],
    minify: "esbuild",
    // Aggressive chunk size limits for better caching
    chunkSizeWarningLimit: 200,
    cssCodeSplit: true,
    // Enable source maps only in development mode
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: id => {
          // React core and essential dependencies
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
            return "react-core";
          }

          // Radix UI components - split into smaller chunks
          if (id.includes("@radix-ui")) {
            if (id.includes("dialog") || id.includes("dropdown") || id.includes("popover")) {
              return "ui-overlay";
            }
            if (id.includes("form") || id.includes("input") || id.includes("select")) {
              return "ui-form";
            }
            if (id.includes("toast") || id.includes("alert")) {
              return "ui-feedback";
            }
            return "ui-base";
          }

          // Form handling
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
            return "form-lib";
          }

          // Charts and visualization
          if (id.includes("recharts") || id.includes("chart")) {
            return "charts";
          }

          // Data fetching and state management
          if (id.includes("@tanstack/react-query")) {
            return "query-lib";
          }

          // Supabase and authentication
          if (id.includes("@supabase") || id.includes("supabase")) {
            return "supabase";
          }

          // Utilities and helpers
          if (
            id.includes("date-fns") ||
            id.includes("dompurify") ||
            id.includes("clsx") ||
            id.includes("class-variance-authority")
          ) {
            return "utils";
          }

          // Styling and theming
          if (id.includes("tailwind") || id.includes("next-themes")) {
            return "theme";
          }

          // Icons and images
          if (id.includes("lucide-react") || id.includes("react-image-crop")) {
            return "icons-media";
          }

          // Large admin components - separate chunk
          if (id.includes("AdminDashboard") || id.includes("admin/")) {
            return "admin-dashboard";
          }

          // Authentication pages
          if (id.includes("Auth.tsx") || id.includes("ProfilePage") || id.includes("AuthContext")) {
            return "auth-pages";
          }

          // Content pages - split by feature
          if (id.includes("PublicationsPage") || id.includes("PublicationDetail")) {
            return "content-publications";
          }

          if (id.includes("CoursesPage") || id.includes("CourseDetail")) {
            return "content-courses";
          }

          if (id.includes("ToolsPage") || id.includes("ToolDetailPage")) {
            return "content-tools";
          }

          // Contact and support pages
          if (id.includes("ContactPage") || id.includes("SupportPage")) {
            return "content-static";
          }

          // Shared components
          if (id.includes("/components/") && !id.includes("/ui/")) {
            return "shared-components";
          }

          // Nebegrupuojame viso likusio turinio į vieną "vendor-misc" chunko,
          // nes tai gali keisti inicializacijos tvarką ir sukelti TDZ klaidas.
        },
        // Optimized chunk and asset naming
        chunkFileNames: chunkInfo => {
          const name = chunkInfo.name || "chunk";
          // Use shorter hashes for better caching while maintaining uniqueness
          return `js/${name}-[hash:8].js`;
        },
        entryFileNames: "js/[name]-[hash:8].js",
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split(".") ?? [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext ?? "")) {
            return `images/[name]-[hash:8][extname]`;
          }
          if (/css/i.test(ext ?? "")) {
            return `css/[name]-[hash:8][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(ext ?? "")) {
            return `fonts/[name]-[hash:8][extname]`;
          }
          return `assets/[name]-[hash:8][extname]`;
        },
      },
      // Sumažiname agresyvų treeshake, kad išvengtume neteisingo modulio inicializavimo tvarkos
      // ir su tuo susijusių TDZ ("Cannot access 'x' before initialization") klaidų gamyboje.
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      // Optimize external dependencies
      external: id => {
        // Mark heavy analytics libraries as external if not critical
        return false; // Keep all dependencies bundled for now
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "@tanstack/react-query",
      // Pre-bundle critical UI components
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    exclude: [
      // Don't pre-bundle heavy components
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "recharts",
      "react-image-crop",
    ],
    // Enable for better performance with many dependencies
    force: true,
  },
  // Enhanced esbuild configuration
  esbuild: {
    legalComments: "none",
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // Remove debugging code in production
    drop: mode === "production" ? ["console", "debugger"] : [],
    pure:
      mode === "production" ? ["console.log", "console.info", "console.debug", "console.warn"] : [],
    // Enable advanced optimizations
    treeShaking: true,
    // Use modern JavaScript features for smaller output
    target: "es2020",
    // Optimize for better compression
    keepNames: false,
  },
  // Define constants for better tree shaking
  define: {
    __DEV__: mode === "development",
    __PROD__: mode === "production",
    // Remove process.env checks in production
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
}));
