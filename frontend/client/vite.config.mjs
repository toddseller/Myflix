import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // MMDb's CORS settings allow localhost:3000, so the dev server stays on Create React App's port.
  server: { port: 3000 },
  // The Dockerfile copies build/ into nginx.
  build: { outDir: 'build' },
  test: { environment: 'jsdom', globals: true }
})
