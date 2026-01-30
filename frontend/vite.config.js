import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When you call "/api/predict" in your code, 
      // Vite redirects it to your Render URL locally
      '/api': {
        target: 'https://pulsehealth.onrender.com/', // 👈 REPLACE with your actual Render URL
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})