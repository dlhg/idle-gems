import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This sets host to '0.0.0.0' to listen on all interfaces
    strictPort: true, // Ensures the port is not automatically changed if occupied
    port: 80 // Sets the server port, ensure this is the port you want and is allowed in your deployment environment
  }
})
