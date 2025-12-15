// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Express (songs, etc.) on 4000:
      '/api/songs': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },

      // CV FastAPI on 8000:
      '/api/stream': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
