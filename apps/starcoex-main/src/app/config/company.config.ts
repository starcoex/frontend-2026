export const COMPANY_INFO = {
  name: '스타코엑스',
  nameEn: 'STARCOEX',
  businessNumber: '123-45-67890',
  representative: '김현진',
  address: '제주시 연삼로 79',
  phone: '064-713-2002',
  email: 'starcoex@naver.co.kr',
  hours: '09:00 - 18:00',
  description:
    '별표주유소, 난방유 배달, 제라게 카케어, 세차 서비스를 제공하는 종합 에너지 및 자동차 관리 솔루션 회사입니다. 통합 포털과 각 서비스별 전용 앱으로 더욱 편리한 서비스를 제공합니다.',

  // 도메인 설정
  domains: {
    main: 'starcoex.com',
    gasStation: 'gas-station.starcoex.com',
    carWash: 'car-wash.starcoex.com',
    fuelDelivery: 'fuels-delivery.starcoex.com',
    admin: 'admin.starcoex.com',
  },

  // 슬라이드 형태의 Hero 섹션
  heroSlides: [
    {
      id: 'main',
      title: '종합 에너지 & 자동차 관리',
      subtitle: '통합 플랫폼',
      description:
        '별표주유소, 난방유 배달, 세차, 카케어까지\n모든 서비스를 한 곳에서 간편하게',
      primaryButton: {
        text: '서비스 둘러보기',
        action: 'services',
      },
      secondaryButton: {
        text: '간편 가입하기',
        action: 'register',
      },
      backgroundImage: 'main',
    },
    {
      id: 'hybrid-platform',
      title: '하이브리드 서비스',
      subtitle: '포털 + 전용 앱',
      description:
        '통합 포털에서 모든 서비스를 한눈에\n각 서비스별 전용 앱으로 더욱 편리하게',
      primaryButton: {
        text: '전용 앱 보기',
        action: 'apps',
      },
      secondaryButton: {
        text: '포털 둘러보기',
        action: 'portal',
      },
      backgroundImage: 'hero-hybrid',
    },
    {
      id: 'event1',
      title: '신년 특가 이벤트',
      subtitle: '최대 30% 할인',
      description:
        '새해를 맞아 모든 서비스 특가 제공\n소셜 로그인으로 간편하게 가입하고 혜택을 받아보세요',
      primaryButton: {
        text: '이벤트 참여하기',
        action: 'event',
      },
      secondaryButton: {
        text: '카카오 간편가입',
        action: 'kakao-login',
      },
      backgroundImage: 'hero-event1',
    },
    {
      id: 'service-highlight',
      title: '프리미엄 세차 서비스',
      subtitle: '전용 앱 런칭',
      description:
        '전문가가 직접 방문하는 프리미엄 세차\n새 앱 출시 기념 첫 이용 고객 50% 할인',
      primaryButton: {
        text: '세차 앱으로 이동',
        action: 'car-wash-app',
      },
      secondaryButton: {
        text: '서비스 소개',
        action: 'service-info',
      },
      backgroundImage: 'hero-carwash',
    },
  ],

  stats: [
    { label: '누적 고객 수', value: '10,000+', key: 'customers' },
    { label: '운영 년수', value: '15년', key: 'years' },
    { label: '고객 만족도', value: '98%', key: 'satisfaction' },
    { label: '서비스 앱', value: '4개', key: 'apps' }, // 새로 추가
  ],

  // 앱별 정보
  apps: {
    portal: {
      name: '스타코엑스 포털',
      description: '모든 서비스를 한눈에',
      url: 'https://starcoex.com',
      features: ['서비스 소개', '통합 회원가입', '소셜 로그인', '서비스 연결'],
    },
    gasStation: {
      name: '별표주유소 앱',
      description: '주유소 전용 서비스',
      url: 'https://gas-station.starcoex.com',
      features: ['주유소 찾기', '가격 비교', '간편 결제', '소셜 로그인'],
    },
    carWash: {
      name: '세차 서비스 앱',
      description: '세차 예약 전용',
      url: 'https://car-wash.starcoex.com',
      features: ['온라인 예약', '실시간 진행상황', '간편 결제', '소셜 로그인'],
    },
    fuelDelivery: {
      name: '난방유 배달 앱',
      description: '난방유 주문 전용',
      url: 'https://fuel-delivery.starcoex.com',
      features: ['간편 주문', '배송 추적', '정기 배송', '소셜 로그인'],
    },
    admin: {
      name: '사업자 관리',
      description: '사업자 전용 시스템',
      url: 'https://admin.starcoex.com',
      features: ['사업장 관리', '매출 분석', '승인 프로세스', '전용 대시보드'],
    },
  },

  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    blog: '',
  },
} as const;
