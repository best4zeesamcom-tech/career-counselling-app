import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://career-counselling-app--best4zeesamcom.replit.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://career-counselling-app--best4zeesamcom.replit.app')
  }
})