import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Change 'dota' to your repository name if different
  base: process.env.NODE_ENV === 'production' ? '/dota/' : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
