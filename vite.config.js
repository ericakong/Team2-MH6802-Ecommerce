import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // 👇 Add this proxy block so FE calls /api/* and Vite forwards to your Node API on 3001
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // no rewrite needed because your backend route is /api/chat
        // If your backend were just /chat you’d use:
        // rewrite: (p) => p.replace(/^\/api/, '')
      },
    },
  },
  build: {
    sourcemap: true
  }
})