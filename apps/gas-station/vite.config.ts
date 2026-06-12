import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { VitePWA } from 'vite-plugin-pwa';

const API_BASE_URL = 'https://api.starcoex.com';
const LIBS = path.resolve(__dirname, '../../libs');

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/gas-station',
  server: {
    port: 4202,
    host: '0.0.0.0',
    proxy: {
      // ✅ GraphQL → 실서버 Gateway (Query / Mutation / Subscription)
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
      // ✅ 채팅 Socket.io → 실서버 (chat-gateway path: /chat/socket.io)
      '/chat/socket.io': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
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
    port: 4302,
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
        name: '별표주유소',
        short_name: '별표주유소',
        description: '별표주유소 서비스',
        theme_color: '#0ea5e9',
        background_color: '#0f172a',
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
      '@starcoex-frontend/vehicles': `${LIBS}/features/vehicles/src/index.ts`,
      '@starcoex-frontend/notifications': `${LIBS}/features/notifications/src/index.ts`,
      '@starcoex-frontend/loyalty': `${LIBS}/features/loyalty/src/index.ts`,
      '@starcoex-frontend/stores': `${LIBS}/features/stores/src/index.ts`,
      '@starcoex-frontend/products': `${LIBS}/features/products/src/index.ts`,
      '@starcoex-frontend/orders': `${LIBS}/features/orders/src/index.ts`,
      '@starcoex-frontend/payments': `${LIBS}/features/payments/src/index.ts`,
      '@starcoex-frontend/cart': `${LIBS}/features/cart/src/index.ts`,
      '@starcoex-frontend/chats': `${LIBS}/features/chats/src/index.ts`,
      '@starcoex-frontend/delivery': `${LIBS}/features/delivery/src/index.ts`,
      '@starcoex-frontend/address': `${LIBS}/features/address/src/index.ts`,
      '@starcoex-frontend/reviews': `${LIBS}/features/reviews/src/index.ts`,
      '@starcoex-frontend/promotions': `${LIBS}/features/promotions/src/index.ts`,
      '@starcoex-frontend/jobs': `${LIBS}/features/jobs/src/index.ts`,
      '@starcoex-frontend/queue': `${LIBS}/features/queue/src/index.ts`,
      '@starcoex-frontend/contact': `${LIBS}/features/contact/src/index.ts`,
      '@starcoex-frontend/pwa': `${LIBS}/pwa/src/index.ts`,
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
          if (id.includes('node_modules/motion')) return 'vendor-motion';
          if (id.includes('node_modules/html2canvas'))
            return 'vendor-html2canvas';

          // ✅ Apollo + graphql + common 계열 전체 통합
          if (id.includes('node_modules/@apollo')) return 'lib-core';
          if (id.includes('libs/graphql')) return 'lib-core';
          if (id.includes('libs/features/auth')) return 'lib-core';
          if (id.includes('libs/features/common')) return 'lib-core';
          if (id.includes('libs/features/loyalty')) return 'lib-core';
          if (id.includes('libs/features/address')) return 'lib-core';
          if (id.includes('libs/features/cart')) return 'lib-core';
          if (id.includes('libs/features/notifications')) return 'lib-core';
          if (id.includes('libs/features/products')) return 'lib-core';

          // ✅ 독립 libs
          if (id.includes('libs/features/vehicles')) return 'lib-vehicles';
          if (id.includes('libs/features/stores')) return 'lib-stores';
          if (id.includes('libs/features/orders')) return 'lib-orders';
          if (id.includes('libs/features/payments')) return 'lib-payments';
          if (id.includes('libs/features/chats')) return 'lib-chats';
          if (id.includes('libs/features/delivery')) return 'lib-delivery';
          if (id.includes('libs/features/reviews')) return 'lib-reviews';
          if (id.includes('libs/features/promotions')) return 'lib-promotions';
          if (id.includes('libs/features/contact')) return 'lib-contact';
          if (id.includes('libs/features/jobs')) return 'lib-jobs';
          if (id.includes('libs/features/queue')) return 'lib-queue';
          if (id.includes('libs/pwa')) return 'lib-pwa';

          return undefined;
        },
      },
    },
  },
}));
