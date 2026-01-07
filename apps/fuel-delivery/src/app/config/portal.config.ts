/**
 * 🚛 Fuel Delivery 포털 연동 설정
 */
export const portalConfig = {
  // 현재 포털 도메인
  currentPortalDomain: 'starcoex.com',

  // 포털 연동 정보
  portal: {
    mainUrl: 'https://starcoex.com',
    apiUrl: 'https://api.starcoex.com',
    authUrl: 'https://auth.starcoex.com',
  },

  // API 엔드포인트
  api: {
    baseUrl: 'https://api.starcoex.com',
    endpoints: {
      validateToken: '/auth/validate',
      refreshToken: '/auth/refresh',
      userInfo: '/auth/me',
      // 배송 전용 엔드포인트
      deliveryOrders: '/delivery/orders',
      trackingInfo: '/delivery/tracking',
      serviceAreas: '/delivery/areas',
    },
  },

  // 인증 설정
  auth: {
    storageKeys: {
      portalToken: 'starcoex_portal_token',
      refreshToken: 'starcoex_refresh_token',
      tokenExpiry: 'starcoex_token_expiry',
      connectionStatus: 'portal_connection_status',
    },
    tokenRefreshThreshold: 5 * 60 * 1000, // 5분 전 갱신
  },

  // 다른 서비스 앱 연결
  serviceApps: [
    {
      id: 'gas-station',
      name: '별표주유소',
      url: 'https://gas-station.starcoex.com',
      icon: '⛽',
      description: '실시간 연료 가격 정보',
    },
    {
      id: 'car-wash',
      name: '세차 서비스',
      url: 'https://car-wash.starcoex.com',
      icon: '🚗',
      description: '전문 세차 및 카케어',
    },
  ],

  // SSO 설정
  sso: {
    enabled: true,
    providers: ['kakao', 'naver', 'google'],
    redirectUrl: '/auth/callback',
  },

  // 실시간 연동 설정
  realtime: {
    wsUrl: 'wss://ws.starcoex.com/fuels-delivery',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  },
} as const;

export type PortalConfig = typeof portalConfig;
