import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The production build is served from GitHub Pages at /archive001/.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/archive001/' : '/',
  plugins: [react()],
  server: { port: 5173 },
}))
