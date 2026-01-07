// 모든 설정을 중앙에서 내보내기
import { APP_CONFIG } from './app.config';
export { seoConfig } from './seo.config';
export { themeConfig } from './theme.config';
export { portalConfig } from './portal.config';
export {
  serviceConfig,
  type ServiceConfig,
  type VehicleType,
  type WashService,
  type ServiceAddon,
} from './service.config';

// 설정 유틸리티 함수들
export const getConfig = () => APP_CONFIG;

export const isDevelopment = () => {
  return (
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' &&
      window.location.hostname.includes('localhost'))
  );
};

export const isProduction = () => {
  return (
    process.env.NODE_ENV === 'production' &&
    (typeof window === 'undefined' ||
      !window.location.hostname.includes('localhost'))
  );
};

export const getCurrentDomain = () => {
  return APP_CONFIG.app.currentDomain;
};

export const getPortalDomain = () => {
  return APP_CONFIG.portal.currentPortalDomain;
};

// 환경별 설정 오버라이드
export const getEnvironmentConfig = () => {
  const baseConfig = APP_CONFIG;

  if (isDevelopment()) {
    return {
      ...baseConfig,
      portal: {
        ...baseConfig.portal,
        logging: {
          ...baseConfig.portal.logging,
          enabled: true,
          logLevel: 'debug' as const,
        },
      },
    };
  }

  return baseConfig;
};
