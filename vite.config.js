import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasmSharp from '@wasmsharp/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasmSharp()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
