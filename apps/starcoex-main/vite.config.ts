/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/starcoex-main',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      // Auth Service (쿠키 기반 인증)
      '/auth/graphql': {
        target: 'http://localhost:4102',
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/auth\/graphql/, '/graphql'),
        // 쿠키 도메인/경로 재작성 (필수)
        cookieDomainRewrite: { '*': 'localhost' },
        cookiePathRewrite: { '*': '/' },
      },
      // Gateway Service (Federation)
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        ws: true, // WebSocket 지원
        cookieDomainRewrite: { '*': 'localhost' },
        cookiePathRewrite: { '*': '/' },
      },
      '/api': {
        target: 'http://127.0.0.1:4107',
        changeOrigin: true,
        secure: false,
      },
      // Auth 서비스의 REST API는 직접 (파일 업로드)
      '/api/users': {
        target: 'http://127.0.0.1:4102', // localhost -> 127.0.0.1로 변경 Auth 서비스
        changeOrigin: true,
        secure: false,
      },
      // 파일 서빙 추가
      '/api/files': {
        target: 'http://127.0.0.1:4107',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), tailwindcss(), nxViteTsPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
