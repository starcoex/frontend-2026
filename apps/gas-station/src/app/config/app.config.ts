import { seoConfig } from './seo.config';
import { themeConfig } from './theme.config';
import { portalConfig } from './portal.config';
import { serviceConfig } from './service.config';

/**
 * ⛽ Gas Station App 메인 설정
 */
export const APP_CONFIG = {
  // 기본 앱 정보
  app: {
    id: 'gas-station',
    name: '별표주유소',
    shortName: '주유소',
    version: '2.0.0',
    description: '24시간 실시간 연료 가격 모니터링 대시보드',

    // 도메인 정보
    domains: {
      production: 'gas-station.starcoex.com',
      development: 'localhost:3001',
      staging: 'gas-station-staging.starcoex.com',
    },

    // 현재 환경
    get currentDomain() {
      const hostname =
        typeof window !== 'undefined' ? window.location.hostname : '';

      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        return this.domains.development;
      } else if (hostname.includes('staging')) {
        return this.domains.staging;
      } else {
        return this.domains.production;
      }
    },

    // 앱 타입 (독립 앱)
    type: 'standalone' as const,
    category: 'service' as const,
    theme: 'dashboard' as const,
  },

  // API 설정
  api: {
    baseUrl: 'http://localhost:4200',
    timeout: 10000,
    retries: 3,

    realtime: {
      wsUrl: 'http://localhost:4200',
      reconnectDelay: 5000,
      maxReconnectAttempts: 10,
    },
  },

  routes: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    registerPersonal: '/auth/register/personal',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    verifyPhone: '/auth/verify-phone',
    verifySocial: '/auth/verify-social',
    verifySocialCode: '/auth/verify-social-code',
    dashboard: '/dashboard',
    terms: '/terms',
    privacy: '/privacy',
  },

  // 각 설정 모듈 연결
  seo: seoConfig,
  theme: themeConfig,
  portal: portalConfig,
  service: serviceConfig,
} as const;

export type AppConfig = typeof APP_CONFIG;
