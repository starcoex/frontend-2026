import type { AppConfigContextType } from '@starcoex-frontend/common';
import { APP_CONFIG } from './app.config';

/**
 * 🔐 카케어 앱 인증 설정
 * AppConfigProvider의 config prop 타입(Partial<AppConfigContextType>)에 맞춤
 */
export const carWashAuthConfig: Partial<AppConfigContextType> = {
  appName: APP_CONFIG.app.name,
  siteName: APP_CONFIG.seo.siteName,

  getSeoTitle: (pageTitle: string) =>
    `${pageTitle} - ${APP_CONFIG.seo.siteName}`,

  routes: {
    home: APP_CONFIG.routes.home,
    login: APP_CONFIG.routes.login,
    register: APP_CONFIG.routes.register,
    registerPersonal: APP_CONFIG.routes.registerPersonal,
    dashboard: APP_CONFIG.routes.dashboard,
    forgotPassword: APP_CONFIG.routes.forgotPassword,
    resetPassword: APP_CONFIG.routes.resetPassword,
    verifyEmail: APP_CONFIG.routes.verifyEmail,
    verifyPhone: APP_CONFIG.routes.verifyPhone,
    verifySocial: APP_CONFIG.routes.verifySocial,
    verifySocialCode: APP_CONFIG.routes.verifySocialCode,
    // AppConfigContextType 필수 필드 — 필요 시 실제 경로로 교체
    terms: '/terms',
    privacy: '/privacy',
  },
};
