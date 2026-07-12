import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fixed port + strictPort so this app never collides with the sibling casa-barbero (5173).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
})
