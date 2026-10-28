import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT || 8080;
  return {
    plugins: [react()],
    server: {
      port: 5173,
      // In dev, Vite serves the UI and forwards /api to Express. In production Express serves both.
      proxy: { '/api': { target: `http://localhost:${apiPort}`, changeOrigin: true } },
    },
    build: {
      rollupOptions: {
        output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] } },
      },
    },
  };
});
