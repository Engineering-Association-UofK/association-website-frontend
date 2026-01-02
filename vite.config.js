import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to your backend
      '/api': {
        target: 'https://cd80.duckdns.org',
        changeOrigin: true,
        secure: false, // If the backend SSL is self-signed or has issues
      },
    },
  },
})
