/**
 * 🌟 StarCoEx Main App 메인 설정
 */
export const APP_CONFIG = {
  // 기본 앱 정보
  app: {
    id: 'starcoex-main',
    name: '스타코엑스',
    shortName: '스타코엑스',
    version: '1.0.0',
    description: '스타코엑스 통합 플랫폼',

    // 도메인 정보
    domains: {
      production: 'starcoex.com',
      development: 'localhost:3000',
      staging: 'staging.starcoex.com',
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

    // 앱 타입
    type: 'portal' as const,
    category: 'main' as const,
    theme: 'default' as const,
  },

  // API 설정
  api: {
    baseUrl: import.meta.env['VITE_API_URL'] || 'https://api.starcoex.com',
    timeout: 10000,
    retries: 3,
  },

  // SEO 설정
  seo: {
    siteName: '스타코엑스',
    defaultTitle: '스타코엑스 - 통합 플랫폼',
    defaultDescription:
      '스타코엑스 통합 플랫폼에서 다양한 서비스를 이용하세요.',
    defaultKeywords: ['스타코엑스', '통합 플랫폼', '서비스'],
    defaultImage: '/images/og-image.png',
    twitterHandle: '@starcoex',
  },

  // 인증 관련 경로
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
} as const;

export type AppConfig = typeof APP_CONFIG;
