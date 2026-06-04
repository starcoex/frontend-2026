import { seoConfig } from './seo.config';
import { themeConfig } from './theme.config';
import { portalConfig } from './portal.config';
import { deliveryConfig } from './delivery.config';
import { serviceConfig } from './service.config'; // 추가

/**
 * 환경 변수 접근 헬퍼 함수
 */
const getEnvVar = (key: string, defaultValue = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }

  return defaultValue;
};

/**
 * 🚛 Fuel Delivery App 메인 설정
 */
export const APP_CONFIG = {
  // 기본 앱 정보
  app: {
    id: 'fuel-delivery',
    name: '난방유 배달',
    shortName: '배달',
    version: '2.0.0',
    description: '당일 배송 가능한 난방유 주문 및 정기 배송 서비스',

    // 도메인 정보
    domains: {
      production: 'fuels-delivery.starcoex.com',
      development: 'localhost:3003',
      staging: 'fuels-delivery-staging.starcoex.com',
    },

    // 현재 환경
    get currentDomain() {
      if (typeof window === 'undefined') {
        return this.domains.production;
      }

      const hostname = window.location.hostname;

      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        return this.domains.development;
      } else if (hostname.includes('staging')) {
        return this.domains.staging;
      } else {
        return this.domains.production;
      }
    },

    // 현재 환경 타입
    get environment() {
      const mode = getEnvVar('MODE', 'production');
      if (mode === 'development' || this.currentDomain.includes('localhost')) {
        return 'development';
      } else if (this.currentDomain.includes('staging')) {
        return 'staging';
      } else {
        return 'production';
      }
    },

    // 앱 타입 (배송 전용 앱)
    type: 'delivery' as const,
    category: 'logistics' as const,
    theme: 'delivery' as const,
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

  // API 설정
  api: {
    get baseUrl() {
      const envUrl = getEnvVar('VITE_API_URL') || getEnvVar('NX_API_URL');
      if (envUrl) return envUrl;

      const currentEnv = APP_CONFIG.app.environment;
      switch (currentEnv) {
        case 'development':
          return 'http://localhost:3000';
        case 'staging':
          return 'https://api-staging.starcoex.com';
        case 'production':
        default:
          return 'https://api.starcoex.com';
      }
    },

    timeout: 15000, // 배송 관련 API는 좀 더 긴 타임아웃
    retries: 3,

    // 배송 추적 WebSocket
    realtime: {
      get wsUrl() {
        const envUrl = getEnvVar('VITE_WS_URL') || getEnvVar('NX_WS_URL');
        if (envUrl) return envUrl;

        const currentEnv = APP_CONFIG.app.environment;
        switch (currentEnv) {
          case 'development':
            return 'ws://localhost:3000/delivery';
          case 'staging':
            return 'wss://ws-staging.starcoex.com/delivery';
          case 'production':
          default:
            return 'wss://ws.starcoex.com/delivery';
        }
      },

      reconnectDelay: 5000,
      maxReconnectAttempts: 10,
      trackingUpdateInterval: 30000, // 30초마다 배송 상태 업데이트
    },
  },

  // 개발/디버깅 설정
  debug: {
    enabled: getEnvVar('VITE_DEBUG', 'false') === 'true',
    logLevel: getEnvVar('VITE_LOG_LEVEL', 'info'),
    showDeliveryRoutes:
      getEnvVar('VITE_SHOW_DELIVERY_ROUTES', 'false') === 'true',
  },

  // 기능 플래그
  features: {
    realTimeTracking: getEnvVar('VITE_ENABLE_TRACKING', 'true') === 'true',
    subscriptionOrders:
      getEnvVar('VITE_ENABLE_SUBSCRIPTION', 'true') === 'true',
    phoneOrders: getEnvVar('VITE_ENABLE_PHONE_ORDERS', 'true') === 'true',
    areaExpansion: getEnvVar('VITE_ENABLE_AREA_EXPANSION', 'false') === 'true',
    bulkOrders: getEnvVar('VITE_ENABLE_BULK_ORDERS', 'true') === 'true',
  },

  // 배송 서비스 설정
  delivery: deliveryConfig,

  // 각 설정 모듈 연결
  seo: seoConfig,
  theme: themeConfig,
  portal: portalConfig,
  service: serviceConfig, // 추가
} as const;

export type AppConfig = typeof APP_CONFIG;
