import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // 'credentialless' still enables SharedArrayBuffer for
      // @imgly/background-removal's multi-threaded WASM path,
      // but — unlike 'require-corp' — it doesn't block cross-origin
      // images (e.g. Cloudinary) that lack a Cross-Origin-Resource-Policy
      // header. It just strips credentials from those requests instead.
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
})