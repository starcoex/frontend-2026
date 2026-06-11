/// <reference types='vitest' />
import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const API_BASE_URL = 'https://api.starcoex.com';
const LIBS = path.resolve(__dirname, '../../libs');

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/admin-dashboard',
  server: {
    port: 4201,
    host: '0.0.0.0', // ← 'localhost' 에서 변경 (외부 기기 접근 허용)
    proxy: {
      // ✅ 모든 GraphQL (Query / Mutation / Subscription) → Gateway 단일 엔드포인트
      '/graphql': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
        cookieDomainRewrite: { '*': '' }, // ← 'localhost' 대신 빈 문자열 (도메인 제거)
        cookiePathRewrite: { '*': '/' },
        configure: (proxy) => {
          // ✅ 백엔드 쿠키의 Secure, SameSite=None 제거 → localhost HTTP에서 저장 가능
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
          'apollo-require-preflight': 'true', // ✅ CSRF 방어 통과
        },
      },
      // ✅ 채팅 서비스 Socket.io → chats 서비스(4105)
      '/chat/socket.io': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
        // path rewrite 없음 — Ingress가 /chat/socket.io 경로 그대로 받아서 처리
      },
      // ✅ 배달 서비스 Socket.io → delivery 서비스(4106)
      '/delivery/socket.io': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
      // ✅ 대기열 서비스 Socket.io → queue 서비스(1421)
      '/queue/socket.io': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
      // ✅ 배달 서비스 REST API (운전면허 OCR/진위확인)
      '/driver-license': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => `/api${path}`, // ✅ /api prefix 추가
        cookieDomainRewrite: { '*': 'localhost' },
        cookiePathRewrite: { '*': '/' },
      },
      // Auth 서비스의 REST API는 직접 (파일 업로드)
      '/api/users': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          // ✅ 쿠키의 Secure, SameSite=None 제거 → localhost HTTP에서 저장 가능
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
      // ✅ 미디어(MinIO) 업로드/파일 서빙 → 포트 4109
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
      // ✅ Push 알림: /push/* → rewrite → /api/push/* → 4111
      //    반드시 /api 보다 위에 선언해야 함
      '/push': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => `/api${path}`, // /push/vapid-key → /api/push/vapid-key
      },
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 4201,
    host: 'localhost',
  },
  plugins: [
    react(),
    tailwindcss(),
    nxViteTsPaths(),
    VitePWA({
      // ✅ 기존 service-worker.ts 를 직접 사용
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'service-worker.ts',
      injectManifest: {
        injectionPoint: undefined,
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Starcoex Admin',
        short_name: 'Admin',
        description: 'Starcoex 관리자 대시보드',
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
      '@starcoex-frontend/vehicles': `${LIBS}/features/vehicles/src/index.ts`,
      '@starcoex-frontend/notifications': `${LIBS}/features/notifications/src/index.ts`,
      '@starcoex-frontend/media': `${LIBS}/features/media/src/index.ts`,
      '@starcoex-frontend/analytics': `${LIBS}/features/analytics/src/index.ts`,
      '@starcoex-frontend/loyalty': `${LIBS}/features/loyalty/src/index.ts`,
      '@starcoex-frontend/stores': `${LIBS}/features/stores/src/index.ts`,
      '@starcoex-frontend/products': `${LIBS}/features/products/src/index.ts`,
      '@starcoex-frontend/categories': `${LIBS}/features/categories/src/index.ts`,
      '@starcoex-frontend/orders': `${LIBS}/features/orders/src/index.ts`,
      '@starcoex-frontend/delivery': `${LIBS}/features/delivery/src/index.ts`,
      '@starcoex-frontend/reservations': `${LIBS}/features/reservations/src/index.ts`,
      '@starcoex-frontend/payments': `${LIBS}/features/payments/src/index.ts`,
      '@starcoex-frontend/cart': `${LIBS}/features/cart/src/index.ts`,
      '@starcoex-frontend/chats': `${LIBS}/features/chats/src/index.ts`,
      '@starcoex-frontend/inventory': `${LIBS}/features/inventory/src/index.ts`,
      '@starcoex-frontend/address': `${LIBS}/features/address/src/index.ts`,
      '@starcoex-frontend/reviews': `${LIBS}/features/reviews/src/index.ts`,
      '@starcoex-frontend/promotions': `${LIBS}/features/promotions/src/index.ts`,
      '@starcoex-frontend/suggestions': `${LIBS}/features/suggestions/src/index.ts`,
      '@starcoex-frontend/notices': `${LIBS}/features/notices/src/index.ts`,
      '@starcoex-frontend/pwa': `${LIBS}/pwa/src/index.ts`,
      '@starcoex-frontend/queue': `${LIBS}/features/queue/src/index.ts`,
      '@starcoex-frontend/jobs': `${LIBS}/features/jobs/src/index.ts`,
      '@starcoex-frontend/contact': `${LIBS}/features/contact/src/index.ts`,
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
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
          // ✅ vendor 라이브러리 분리
          if (id.includes('node_modules/@apollo/client/react'))
            return 'vendor-apollo';
          if (id.includes('node_modules/@apollo/client/core'))
            return 'vendor-apollo-core';
          if (id.includes('node_modules/@apollo')) return 'vendor-apollo';
          if (id.includes('node_modules/motion')) return 'vendor-motion';
          if (id.includes('node_modules/@radix-ui')) return 'vendor-ui';
          if (id.includes('node_modules/html2canvas'))
            return 'vendor-html2canvas';

          // ✅ lib-common 분리 가능한 것만 분리
          // (순환참조 있는 것은 lib-common으로 통합)
          if (id.includes('libs/features/common/src/lib/logo'))
            return 'lib-common-logo';
          if (id.includes('libs/features/common/src/lib/seo'))
            return 'lib-common-seo';

          // ✅ 순환참조 있는 항목들 → lib-common으로 통합 유지
          // customer, cart, notifications, membership-dashboard
          // → lib-common 내부에서 서로 참조하므로 분리 불가

          // ✅ auth → lib-common과 함께
          if (id.includes('libs/features/auth')) return 'lib-common';

          // ✅ 나머지 common 전체 → lib-common
          if (id.includes('libs/features/common')) return 'lib-common';

          // ✅ lib-products 전체 통합
          if (id.includes('libs/features/products')) return 'lib-products';

          // ✅ libs 도메인별 분리
          if (id.includes('libs/graphql')) return 'lib-graphql';
          if (id.includes('libs/features/vehicles')) return 'lib-vehicles';
          if (id.includes('libs/features/notifications'))
            return 'lib-notifications';
          if (id.includes('libs/features/media')) return 'lib-media';
          if (id.includes('libs/features/analytics')) return 'lib-analytics';
          if (id.includes('libs/features/loyalty')) return 'lib-loyalty';
          if (id.includes('libs/features/stores')) return 'lib-stores';
          if (id.includes('libs/features/categories')) return 'lib-categories';
          if (id.includes('libs/features/orders')) return 'lib-orders';
          if (id.includes('libs/features/delivery')) return 'lib-delivery';
          if (id.includes('libs/features/reservations'))
            return 'lib-reservations';
          if (id.includes('libs/features/payments')) return 'lib-payments';
          if (id.includes('libs/features/cart')) return 'lib-cart';
          if (id.includes('libs/features/chats')) return 'lib-chats';
          if (id.includes('libs/features/inventory')) return 'lib-inventory';
          if (id.includes('libs/features/address')) return 'lib-address';
          if (id.includes('libs/features/reviews')) return 'lib-reviews';
          if (id.includes('libs/features/promotions')) return 'lib-promotions';
          if (id.includes('libs/features/suggestions'))
            return 'lib-suggestions';
          if (id.includes('libs/features/notices')) return 'lib-notices';
        },
      },
    },
  },
}));
