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

    // 도메인 정보
    domains: {
      production: 'car-wash.starcoex.com',
      development: 'localhost:3002',
      staging: 'car-wash-staging.starcoex.com',
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
  },

  // 각 설정 모듈 연결
  seo: seoConfig,
  theme: themeConfig,
  portal: portalConfig,
  service: serviceConfig,
} as const;

export type AppConfig = typeof APP_CONFIG;
