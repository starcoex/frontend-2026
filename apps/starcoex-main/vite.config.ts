/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const API_BASE_URL = 'https://api.starcoex.com';
const LIBS = path.resolve(__dirname, '../../libs');

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/starcoex-main',
  server: {
    port: 4200,
    host: '0.0.0.0',
    proxy: {
      // ✅ GraphQL → 실서버
      '/graphql': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
        cookieDomainRewrite: { '*': '' },
        cookiePathRewrite: { '*': '/' },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*SameSite=None/gi, '')
                  .replace(/;\s*Domain=[^;]*/gi, '')
              );
            }
          });
        },
        headers: {
          'apollo-require-preflight': 'true',
        },
      },
      // Auth 서비스의 REST API (파일 업로드)
      '/api/users': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*SameSite=None/gi, '')
                  .replace(/;\s*Domain=[^;]*/gi, '')
              );
            }
          });
        },
      },
      // ✅ 미디어(MinIO) 업로드/파일 서빙
      '/api/minio': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
      },
      '/api/files': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
      },
      // ✅ Push 알림: /push/* → rewrite → /api/push/*
      //    반드시 /api 보다 위에 선언해야 함
      '/push': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => `/api${path}`,
      },
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    tailwindcss(),
    nxViteTsPaths(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'service-worker.ts',
      injectManifest: {
        injectionPoint: undefined,
      },
      registerType: 'autoUpdate',
      manifest: {
        name: '스타코엑스',
        short_name: '스타코엑스',
        description: '스타코엑스 서비스',
        theme_color: '#980115',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@starcoex-frontend/graphql': `${LIBS}/graphql/src/index.ts`,
      '@starcoex-frontend/auth': `${LIBS}/features/auth/src/index.ts`,
      '@starcoex-frontend/common': `${LIBS}/features/common/src/index.ts`,
      '@starcoex-frontend/notifications': `${LIBS}/features/notifications/src/index.ts`,
      '@starcoex-frontend/loyalty': `${LIBS}/features/loyalty/src/index.ts`,
      '@starcoex-frontend/stores': `${LIBS}/features/stores/src/index.ts`,
      '@starcoex-frontend/products': `${LIBS}/features/products/src/index.ts`,
      '@starcoex-frontend/orders': `${LIBS}/features/orders/src/index.ts`,
      '@starcoex-frontend/payments': `${LIBS}/features/payments/src/index.ts`,
      '@starcoex-frontend/cart': `${LIBS}/features/cart/src/index.ts`,
      '@starcoex-frontend/address': `${LIBS}/features/address/src/index.ts`,
      '@starcoex-frontend/reviews': `${LIBS}/features/reviews/src/index.ts`,
      '@starcoex-frontend/promotions': `${LIBS}/features/promotions/src/index.ts`,
      '@starcoex-frontend/notices': `${LIBS}/features/notices/src/index.ts`,
      '@starcoex-frontend/pwa': `${LIBS}/pwa/src/index.ts`,
      '@starcoex-frontend/queue': `${LIBS}/features/queue/src/index.ts`,
      '@starcoex-frontend/jobs': `${LIBS}/features/jobs/src/index.ts`,
      '@starcoex-frontend/contact': `${LIBS}/features/contact/src/index.ts`,
      '@starcoex-frontend/media': `${LIBS}/features/media/src/index.ts`,
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ✅ 순환참조 없는 독립 vendor만 분리
          if (id.includes('node_modules/motion')) return 'vendor-motion';
          if (id.includes('node_modules/html2canvas'))
            return 'vendor-html2canvas';

          // ✅ libs 전체를 단일 청크로 통합
          //    graphql ↔ features 간 코드 레벨 순환참조로 인해
          //    청크 분리 시 Circular chunk 경고 불가피 → 단일 통합
          if (id.includes('node_modules/@apollo')) return 'lib-core';
          if (id.includes('node_modules/graphql')) return 'lib-core';
          if (id.includes('/libs/')) return 'lib-core';

          // ✅ 독립 vendor
          if (id.includes('libs/pwa')) return 'lib-pwa';

          return undefined;
        },
      },
    },
  },
}));
