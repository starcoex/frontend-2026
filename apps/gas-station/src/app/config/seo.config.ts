/**
 * ⛽ Gas Station SEO 설정
 */
export const seoConfig = {
  siteName: '별표주유소',
  defaultTitle: '별표주유소 - 24시간 실시간 연료 가격 대시보드',
  defaultDescription:
    '실시간 연료 가격 모니터링과 스마트한 주유소 서비스. 24시간 운영하는 별표주유소에서 최고의 연료와 서비스를 경험하세요.',
  keywords: [
    '별표주유소',
    '실시간 유가',
    '연료 가격',
    '주유소 대시보드',
    '24시간 주유소',
    '휘발유',
    '경유',
    'LPG',
    '등유',
    '스마트 주유소',
    '연료 모니터링',
    '주유소 찾기',
    '스타코엑스',
  ],

  // Open Graph
  og: {
    type: 'website',
    siteName: '별표주유소',
    image: '/images/og-gas-station-dashboard.jpg',
    imageAlt: '별표주유소 - 실시간 연료 가격 대시보드',
    locale: 'ko_KR',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@starcoex_official',
    creator: '@starcoex_official',
  },

  // JSON-LD 구조화 데이터
  structuredData: {
    organization: {
      name: '별표주유소',
      description: '24시간 실시간 연료 가격 모니터링 시스템',
      url: 'https://gas-station.starcoex.com',
      serviceType: [
        '주유소',
        '연료 공급',
        '실시간 가격 모니터링',
        '차량 서비스',
      ],
    },
  },
} as const;
