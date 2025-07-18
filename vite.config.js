import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Base URL seulement pour la production (GitHub Pages)
  base: command === 'build' ? '/commerce-dashboard/' : '/',
  build: {
    outDir: 'docs',
  },
}))
