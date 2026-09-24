import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/stockwise-ai-app/',
  build: {
    outDir: 'dist',
  },
})
