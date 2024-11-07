import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        // changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // ex) proxy설정 : 요청시 /api 붙이고 /terms ~~ 적기.
      },
    },
  },
  resolve: {
    alias: {
      '~/components': '/src/components',
      '~/lib': '/src/lib',
      '~/routes': '/src/routes',
      '~/routers': '/src/routers',
      '~/pages': '/src/pages',
    },
  },
});
