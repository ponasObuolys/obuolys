import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-switch'
          ],
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          'chart-vendor': ['recharts'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],

          // Feature chunks
          'admin-chunk': [
            './src/pages/AdminDashboard.tsx'
          ],
          'auth-chunk': [
            './src/pages/Auth.tsx',
            './src/pages/ProfilePage.tsx',
            './src/context/AuthContext.tsx'
          ],
          'content-chunk': [
            './src/pages/PublicationsPage.tsx',
            './src/pages/PublicationDetail.tsx',
            './src/pages/CoursesPage.tsx',
            './src/pages/CourseDetail.tsx',
            './src/pages/ToolsPage.tsx',
            './src/pages/ToolDetailPage.tsx'
          ]
        },
        // Dynamic chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext ?? '')) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext ?? '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    // Optimization settings
    target: 'esnext',
    minify: 'esbuild',
    // Chunk size optimization
    chunkSizeWarningLimit: 300,
    // CSS code splitting
    cssCodeSplit: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@tanstack/react-query',
      'react-router-dom'
    ],
    exclude: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select'
    ]
  },
  // Performance optimizations
  esbuild: {
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    drop: ['console', 'debugger'],
    pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
  }
}));
