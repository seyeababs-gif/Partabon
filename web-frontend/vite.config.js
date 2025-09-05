import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // autoriser l’URL publique Replit
    allowedHosts: ['.replit.dev'] // le . permet d’accepter toutes les sous-domaines Replit
  }
})
