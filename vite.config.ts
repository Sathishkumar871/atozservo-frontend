import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',           // ✅ dist will be created inside current folder
    emptyOutDir: true,        // ✅ cleans old files before build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Optional: better chunking
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: suppress big file warning
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
  },
});
