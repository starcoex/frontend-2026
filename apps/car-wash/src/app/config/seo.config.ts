/**
 * 🔍 SEO 및 메타데이터 설정
 */
export const seoConfig = {
  // 기본 SEO 설정
  siteName: '스타코엑스 세차',
  separator: ' | ',
  defaultTitle: '전문 세차 예약 서비스',
  defaultDescription: '전문적이고 편리한 온라인 세차 예약 서비스. 스타코엑스 통합 계정으로 간편하게 이용하세요.',
  
  // 키워드 카테고리별 정리
  keywords: {
    primary: ['세차', '세차예약', '자동차세차', '온라인예약'],
    brand: ['스타코엑스', '스타코엑스세차'],
    service: ['자동세차', '손세차', '프리미엄세차', '세차장'],
    location: ['서울세차', '전국세차', '방문세차'],
    features: ['간편예약', '실시간예약', '포털연동', '자동로그인'],
  },
  
  // 페이지별 SEO 설정
  pages: {
    home: {
      title: '홈',
      description: '전문적인 세차 서비스를 온라인으로 간편하게 예약하세요.',
      keywords: ['세차예약', '홈페이지', '세차서비스'],
    },
    booking: {
      title: '세차 예약',
      description: '원하는 날짜와 시간에 전문 세차 서비스를 예약하세요.',
      keywords: ['세차예약', '온라인예약', '세차일정', '예약시스템'],
    },
    services: {
      title: '세차 서비스',
      description: '다양한 세차 옵션과 투명한 가격을 확인하세요.',
      keywords: ['세차종류', '세차가격', '세차옵션', '서비스안내'],
    },
    tracking: {
      title: '진행 현황',
      description: '예약한 세차 서비스의 실시간 진행 상황을 확인하세요.',
      keywords: ['세차진행현황', '실시간추적', '예약확인'],
    },
    profile: {
      title: '내 정보',
      description: '예약 내역과 개인 정보를 관리하세요.',
      keywords: ['내정보', '예약내역', '계정관리'],
    },
  },
  
  // Open Graph 이미지 설정
  images: {
    default: '/images/og-car-wash.jpg',
    booking: '/images/og-booking.jpg',
    services: '/images/og-services.jpg',
    tracking: '/images/og-tracking.jpg',
  },
  
  // 소셜 미디어 설정
  social: {
    twitter: '@starcoex_official',
    facebook: 'starcoex.official',
    instagram: 'starcoex_official',
  },
  
} as const;
