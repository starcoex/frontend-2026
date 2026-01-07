
export const COMPANY_INFO = {
  name: '스타코엑스',
  nameEn: 'STARCOEX',
  businessNumber: '123-45-67890',
  representative: '홍길동',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '1588-1234',
  email: 'admin@starcoex.co.kr',
  hours: '24시간 운영',
  description:
    '별표주유소, 난방유 배달, 제라게 카케어, 세차 서비스를 제공하는 종합 에너지 및 자동차 관리 솔루션의 통합 관리 시스템입니다. 사업자, 배달기사, 관리자를 위한 전용 대시보드를 제공합니다.',

  // 관리자 시스템 전용 도메인
  domains: {
    admin: 'admin.starcoex.com',
    main: 'starcoex.com',
    gasStation: 'gas-station.starcoex.com',
    carWash: 'car-wash.starcoex.com',
    fuelDelivery: 'fuel-delivery.starcoex.com',
  },

  // 관리자 시스템 통계
  stats: [
    { label: '등록된 사업자', value: '500+', key: 'businesses' },
    { label: '활성 관리자', value: '50+', key: 'admins' },
    { label: '월 거래액', value: '10억+', key: 'revenue' },
    { label: '시스템 가동률', value: '99.9%', key: 'uptime' },
  ],

  // 관리 대상 서비스
  managedServices: {
    gasStation: {
      name: '별표주유소 관리',
      description: '주유소 운영 및 매출 관리',
      icon: '⛽',
      features: ['매출 분석', '재고 관리', '직원 관리', '고객 관리'],
    },
    fuelDelivery: {
      name: '난방유 배달 관리',
      description: '배달 주문 및 기사 관리',
      icon: '🚛',
      features: ['주문 관리', '배송 추적', '기사 관리', '정산 관리'],
    },
    carWash: {
      name: '세차 서비스 관리',
      description: '세차 예약 및 매장 관리',
      icon: '🚗',
      features: ['예약 관리', '매장 관리', '직원 스케줄', '고객 피드백'],
    },
    zeragaeCare: {
      name: '카케어 관리',
      description: '프리미엄 카케어 서비스 관리',
      icon: '✨',
      features: ['서비스 관리', '예약 시스템', '고객 관리', '품질 관리'],
    },
  },

  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    blog: '',
  },
} as const;
