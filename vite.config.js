import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 혹은 / 사용
  build: {
      outDir: 'dist', // 출력 디렉토리 확인
  },
  resolve: {
    alias: {
      '~/store': '/src/store',
      '~/components': '/src/components',
      '~/lib': '/src/lib',
      '~/routes': '/src/routes',
      '~/routers': '/src/routers',
      '~/pages': '/src/pages',
    },
  },
});
