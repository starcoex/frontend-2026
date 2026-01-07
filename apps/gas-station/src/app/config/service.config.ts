/**
 * ⛽ Gas Station 서비스 설정
 */
export const serviceConfig = {
  // 연료 타입 정의
  fuelTypes: [
    {
      id: 'gasoline',
      name: '휘발유',
      shortName: '휘발유',
      code: 'GAS',
      color: '#EF4444',
      icon: '⛽',
      unit: 'L',
      category: 'automotive',
    },
    {
      id: 'diesel',
      name: '경유',
      shortName: '경유',
      code: 'DIE',
      color: '#22C55E',
      icon: '🚛',
      unit: 'L',
      category: 'automotive',
    },
    {
      id: 'lpg',
      name: 'LPG',
      shortName: 'LPG',
      code: 'LPG',
      color: '#A855F7',
      icon: '🔥',
      unit: 'L',
      category: 'automotive',
    },
    {
      id: 'kerosene',
      name: '등유',
      shortName: '등유',
      code: 'KER',
      color: '#F97316',
      icon: '🏠',
      unit: 'L',
      category: 'heating',
    },
  ],

  // 서비스 운영 시간
  operatingHours: {
    open: '00:00',
    close: '23:59',
    is24Hours: true,
    timezone: 'Asia/Seoul',
  },

  // 결제 방법
  paymentMethods: [
    { id: 'card', name: '신용카드', icon: '💳', enabled: true },
    { id: 'cash', name: '현금', icon: '💰', enabled: true },
    { id: 'mobile', name: '모바일 페이', icon: '📱', enabled: true },
    { id: 'membership', name: '멤버십 카드', icon: '⭐', enabled: true },
    { id: 'crypto', name: '디지털 화폐', icon: '₿', enabled: false },
  ],

  // 추가 서비스
  additionalServices: [
    { id: 'car-wash', name: '세차 서비스', icon: '🚗', available: true },
    { id: 'convenience', name: '편의점', icon: '🏪', available: true },
    { id: 'maintenance', name: '정비 서비스', icon: '🔧', available: true },
    { id: 'tire-service', name: '타이어 서비스', icon: '🛞', available: true },
    { id: 'charging', name: '전기차 충전', icon: '⚡', available: false },
  ],

  // 실시간 데이터 설정
  realTimeData: {
    priceUpdateInterval: 30000, // 30초
    statusCheckInterval: 10000, // 10초
    metricsUpdateInterval: 60000, // 1분
    enableWebSocket: true,
  },

  // 알림 설정
  notifications: {
    priceChange: {
      enabled: true,
      threshold: 10, // 10원 이상 변동 시 알림
    },
    maintenance: {
      enabled: true,
      advanceNotice: 3600000, // 1시간 전 알림
    },
    systemStatus: {
      enabled: true,
    },
  },
} as const;
