export const COMPANY_INFO = {
  name: '스타코엑스',
  nameEn: 'STARCOEX',
  legalName: '주식회사 스타코엑스',
  businessNumber: '864-86-01329',
  representative: '김현진',
  address: '제주특별자치도 제주시 연미길 10(오라삼동)',
  phone: '064-713-2002',
  email: 'starcoex@naver.co.kr',
  hours: '09:00 - 18:00',
  description:
    '제주 별표주유소와 제라게 카케어를 중심으로 주유, 손세차, 난방유 배달까지 제공하는 종합 에너지·자동차 관리 서비스입니다. 세차전용카드 하나로 더욱 편리하게 이용하세요.',

  // 도메인 설정
  domains: {
    main: 'www.starcoex.com',
    gasStation: 'staroil.starcoex.co.kr',
    carWash: 'zeragae.starcoex.co.kr',
    fuelDelivery: 'delivery.starcoex.co.kr',
    admin: 'admin.starcoex.com',
  },

  // 슬라이드 형태의 Hero 섹션 (실제 서비스 기준)
  heroSlides: [
    {
      id: 'main',
      title: '별표주유소 & 제라게 카케어',
      subtitle: '주유부터 손세차까지 한 곳에서',
      description:
        '믿을 수 있는 별표주유소와 제라게 카케어의 외부 손세차\n주유 3만원 이상 또는 세차전용카드로 더 큰 혜택을 받으세요',
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
      id: 'car-wash-price',
      title: '반짝반짝 외부 손세차',
      subtitle: 'Best 추천 · 15분 완성',
      description:
        '버블분사 · 휠세척 · 온수고압세척까지 꼼꼼하게\n승용차 25,000원부터 / 타이어 드레싱 포함',
      primaryButton: {
        text: '세차 가격표 보기',
        action: 'car-wash',
      },
      secondaryButton: {
        text: '서비스 소개',
        action: 'service-info',
      },
      backgroundImage: 'hero-carwash',
    },
    {
      id: 'event1',
      title: '앞유리 유막제거 1만원',
      subtitle: '세차전용카드 적립 혜택',
      description:
        '세차전용카드 이용 시 5만원 결제하면 59,000원 적립!\n주유와 세차를 한 번에, 더 큰 혜택으로 만나보세요',
      primaryButton: {
        text: '카드 혜택 보기',
        action: 'services',
      },
      secondaryButton: {
        text: '카카오 간편가입',
        action: 'kakao-login',
      },
      backgroundImage: 'hero-event1',
    },
    {
      id: 'fuel-delivery',
      title: '난방유 배달 서비스',
      subtitle: '집까지 안전하게',
      description:
        '추운 겨울, 따뜻한 우리 집을 위한 난방유\n전화 한 통으로 빠르고 안전하게 배달해드립니다',
      primaryButton: {
        text: '난방유 주문 문의',
        action: 'phone',
      },
      secondaryButton: {
        text: '서비스 소개',
        action: 'services',
      },
      backgroundImage: 'hero-fuel',
    },
  ],

  stats: [
    { label: '누적 고객 수', value: '10,000+', key: 'customers' },
    { label: '운영 년수', value: '15년', key: 'years' },
    { label: '세차 작업 시간', value: '8~15분', key: 'washTime' },
    { label: '제공 서비스', value: '3종', key: 'services' },
  ],

  // 서비스별 정보 (실제 운영 기준)
  apps: {
    portal: {
      name: '스타코엑스 포털',
      description: '모든 서비스를 한눈에',
      url: 'https://www.starcoex.com',
      features: ['서비스 소개', '통합 회원가입', '소셜 로그인', '서비스 연결'],
    },
    gasStation: {
      name: '별표주유소',
      description: '믿을 수 있는 연료와 합리적인 가격',
      url: 'https://staroil.starcoex.co.kr',
      features: [
        '고품질 연료',
        '앞유리 유막제거',
        '세차 연계 혜택',
        '간편 결제',
      ],
    },
    carWash: {
      name: '제라게 카케어 (외부 손세차)',
      description: '8~15분 완성 외부 손세차',
      url: 'https://zeragae.starcoex.co.kr',
      features: [
        '기본 외부 손세차 (8~9분)',
        '별표 외부 손세차 (12분)',
        '반짝반짝 외부 손세차 (15분)',
        '세차전용카드 적립',
      ],
    },
    fuelDelivery: {
      name: '난방유 배달',
      description: '안전하고 빠른 난방유 배달',
      url: 'https://delivery.starcoex.co.kr',
      features: ['당일 배달', '정기 배달', '전화 주문', '안전 배송'],
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
    instagram: 'https://instagram.com/jeju_secha',
    youtube: '',
    blog: '',
  },
} as const;
