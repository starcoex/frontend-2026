import { seoConfig } from './seo.config';
import { themeConfig } from './theme.config';
import { portalConfig } from './portal.config';
import { serviceConfig } from './service.config';

/**
 * 🚗 Car Wash App 메인 설정
 */
export const APP_CONFIG = {
  // 기본 앱 정보
  app: {
    id: 'car-wash',
    name: '스타코엑스 세차서비스',
    shortName: '세차 서비스',
    version: '1.0.0',
    description: '전문적이고 편리한 온라인 세차 예약 서비스',

    domains: {
      production: 'car-wash.starcoex.com',
      development: 'localhost:3002',
      staging: 'car-wash-staging.starcoex.com',
    },

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

    type: 'standalone' as const,
    category: 'service' as const,
  },

  // ✅ 추가: 라우트 경로 중앙 관리
  routes: {
    home: '/',
    // 🏪 지점
    stores: '/stores',
    storeDetail: (id: string) => `/stores/${id}`,
    // ⚡ 스피드 존
    speed: '/speed',
    speedQueue: '/speed/queue',
    // 💎 프리미엄 존
    premium: '/premium',
    premiumBooking: '/premium/booking',
    // 예약
    bookings: '/bookings',
    bookingDetail: (id: string) => `/bookings/${id}`,
    // 인증
    login: '/auth/login',
    register: '/auth/register',
    registerPersonal: '/auth/register/personal',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    verifySocial: '/auth/verify-social',
    verifySocialCode: '/auth/verify-social-code',
    verifyPhone: '/auth/verify-phone',
    // 대시보드
    dashboard: '/dashboard',
    // 정보
    about: '/about',
    faq: '/faq',
    contact: '/contact',
    notifications: '/notifications',
    terms: '/terms',
    privacy: '/privacy',
    pricing: '/pricing',
    changelog: '/changelog',
  },

  seo: seoConfig,
  theme: themeConfig,
  portal: portalConfig,
  service: serviceConfig,
} as const;

export type AppConfig = typeof APP_CONFIG;
