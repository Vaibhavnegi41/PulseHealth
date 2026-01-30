import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env vars from the root folder
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    build: {
    target: 'esnext',       // modern JS for faster build
    chunkSizeWarningLimit: 2000, // increase if you have large chunks
    sourcemap: false,       // disable source maps for faster build
  },
    server: {
      proxy: {
        // This handles local development only
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})