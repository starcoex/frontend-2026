export interface MembershipType {
  id: string;
  name: string;
  emoji: string;
  emojiLabel: string;
  description: string;
  features: string[];
  recommended?: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  cardStyle: string;
  route: string;
  isExternalLink?: boolean;
  targetDomain?: string;
}

// starcoex-main (포털) - 개인 회원가입만 (소셜 로그인 지원)
export const portalMembershipTypes: MembershipType[] = [
  {
    id: 'personal',
    name: '개인 회원',
    emoji: '👤',
    emojiLabel: '개인',
    description: '간편한 소셜 로그인으로 모든 스타코엑스 서비스를 이용하세요.',
    features: [
      '⚡ 카카오/구글/네이버 간편 로그인',
      '⛽ 주유소 서비스 이용',
      '🚗 세차장 서비스 이용',
      '🚛 주유 배달 서비스 이용',
      '🎁 통합 적립 혜택',
      '🔄 서비스 간 자동 로그인',
    ],
    recommended: true,
    buttonText: '간편 회원가입',
    buttonVariant: 'default',
    cardStyle:
      'cursor-pointer hover:shadow-md transition-all border-primary bg-primary/5 hover:bg-primary/10',
    route: '/auth/register/personal',
  },
  {
    id: 'business-redirect',
    name: '사업자 회원',
    emoji: '🏢',
    emojiLabel: '사업자',
    description: '사업자 전용 관리 시스템으로 이동합니다.',
    features: [
      '📊 전용 관리 대시보드',
      '💼 사업장 등록 및 관리',
      '📈 매출 및 통계 분석',
      '🤝 전용 고객 지원',
      '✅ 승인 프로세스 진행',
    ],
    recommended: false,
    buttonText: '사업자 시스템으로 이동',
    buttonVariant: 'outline',
    cardStyle:
      'cursor-pointer hover:shadow-md transition-all border-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30',
    route: 'https://admin.starcoex.com/auth/register',
    isExternalLink: true,
    targetDomain: 'admin.starcoex.com',
  },
];

// admin-dashboard - 개인 + 사업자 회원가입
export const adminMembershipTypes: MembershipType[] = [
  {
    id: 'personal-admin',
    name: '개인 관리자',
    emoji: '👤',
    emojiLabel: '개인 관리자',
    description: '개인 계정으로 관리 시스템에 접근합니다.',
    features: [
      '🔍 서비스 모니터링',
      '📱 개인 데이터 관리',
      '🎯 맞춤 설정',
      '📞 고객 지원 접근',
    ],
    recommended: false,
    buttonText: '개인 관리자 가입',
    buttonVariant: 'outline',
    cardStyle: 'cursor-pointer hover:shadow-md transition-all',
    route: '/auth/register/personal-admin',
  },
  {
    id: 'business',
    name: '사업자 회원',
    emoji: '🏢',
    emojiLabel: '사업자',
    description: '사업자 인증 후 전용 관리 도구를 이용하실 수 있습니다.',
    features: [
      '🏪 사업장 등록 및 관리',
      '📊 통합 대시보드',
      '💰 매출 및 정산 관리',
      '📈 고급 분석 도구',
      '✅ 사업자 승인 프로세스',
      '🎯 전용 마케팅 도구',
    ],
    recommended: true,
    buttonText: '사업자 회원가입',
    buttonVariant: 'default',
    cardStyle:
      'cursor-pointer hover:shadow-md transition-all border-primary bg-primary/5',
    route: '/auth/register/business',
  },
];

// 소비자 앱들 - 개인 회원가입만 (간단한 소셜 로그인)
export const consumerAppMembershipTypes: MembershipType[] = [
  {
    id: 'personal-simple',
    name: '개인 회원',
    emoji: '👤',
    emojiLabel: '개인',
    description: '간편하게 가입하고 서비스를 이용하세요.',
    features: [
      '⚡ 빠른 소셜 로그인',
      '🎯 해당 서비스 전용 기능',
      '🔄 스타코엑스 통합 계정 연동',
      '🎁 서비스별 맞춤 혜택',
    ],
    recommended: true,
    buttonText: '간편 가입하기',
    buttonVariant: 'default',
    cardStyle:
      'cursor-pointer hover:shadow-md transition-all border-primary bg-primary/5',
    route: '/auth/register/simple',
  },
];

// 앱별 설정
export const appConfigs = {
  'starcoex-main': {
    membershipTypes: portalMembershipTypes,
    allowedTypes: ['personal'],
    socialLoginEnabled: true, // ✅ 소셜 로그인 활성화
    socialProviders: ['google', 'kakao', 'naver'], // ✅ 소셜 제공자 추가
    businessRedirect: 'https://admin.starcoex.com',
  },
  'admin-dashboard': {
    membershipTypes: adminMembershipTypes,
    allowedTypes: ['personal-admin', 'business'],
    socialLoginEnabled: false, // 관리자는 보안상 일반 로그인만
    approvalProcessRequired: true,
  },
  'gas-station': {
    membershipTypes: consumerAppMembershipTypes,
    allowedTypes: ['personal-simple'],
    socialLoginEnabled: true,
    socialProviders: ['google', 'kakao', 'naver'],
  },
  'car-wash': {
    membershipTypes: consumerAppMembershipTypes,
    allowedTypes: ['personal-simple'],
    socialLoginEnabled: true,
    socialProviders: ['google', 'kakao', 'naver'],
  },
  'fuel-delivery': {
    membershipTypes: consumerAppMembershipTypes,
    allowedTypes: ['personal-simple'],
    socialLoginEnabled: true,
    socialProviders: ['google', 'kakao', 'naver'],
  },
};

// 현재 앱에 따른 설정 가져오기
export function getCurrentAppConfig() {
  const hostname =
    typeof window !== 'undefined' ? window.location.hostname : '';

  if (hostname.includes('admin')) {
    return appConfigs['admin-dashboard'];
  } else if (hostname.includes('gas-station')) {
    return appConfigs['gas-station'];
  } else if (hostname.includes('car-wash')) {
    return appConfigs['car-wash'];
  } else if (hostname.includes('fuel-delivery')) {
    return appConfigs['fuel-delivery'];
  } else {
    return appConfigs['starcoex-main'];
  }
}

export const membershipTypes = getCurrentAppConfig().membershipTypes;
