/**
 * 🔗 포털 연동 설정
 */
export const portalConfig = {
  // 포털 도메인 정보
  domains: {
    production: 'starcoex.com',
    development: 'localhost:3001', 
    staging: 'staging.starcoex.com',
  },
  
  // 현재 포털 도메인
  get currentPortalDomain() {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return this.domains.development;
    } else if (hostname.includes('staging')) {
      return this.domains.staging;
    } else {
      return this.domains.production;
    }
  },
  
  // 인증 관련 설정
  auth: {
    // URL 파라미터
    autoLoginParam: 'portal_token',
    redirectParam: 'redirect_url',
    
    // 로컬 스토리지 키
    storageKeys: {
      portalToken: 'starcoex_portal_token',
      authToken: 'starcoex_auth_token', 
      userInfo: 'starcoex_user_info',
      connectionStatus: 'starcoex_portal_connected',
    },
    
    // 세션 설정
    session: {
      timeout: 24 * 60 * 60 * 1000, // 24시간
      refreshThreshold: 60 * 60 * 1000, // 1시간
    },
  },
  
  // API 엔드포인트
  api: {
    baseUrl: '/api/portal',
    endpoints: {
      validateToken: '/auth/validate',
      refreshToken: '/auth/refresh', 
      getUserInfo: '/user/info',
      syncUserData: '/user/sync',
    },
  },
  
  // 연동 상태 관리
  connection: {
    retryAttempts: 3,
    retryDelay: 1000, // 1초
    heartbeatInterval: 5 * 60 * 1000, // 5분
  },
  
  // 로깅 설정
  logging: {
    enabled: process.env.NODE_ENV !== 'production',
    logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error',
    events: {
      connection: true,
      authentication: true,
      userSync: true,
      errors: true,
    },
  },
  
} as const;
