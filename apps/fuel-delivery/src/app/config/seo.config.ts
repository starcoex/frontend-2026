/**
 * 🚛 Fuel Delivery SEO 설정
 */
export const seoConfig = {
  siteName: '난방유 배달 | 스타코엑스',
  defaultTitle: '난방유 배달 - 당일 배송, 정기 배송 서비스',
  defaultDescription:
    '서울, 경기 지역 당일 배송 가능한 난방유 주문 서비스. 정기 배송 할인, 안전한 직배송, 실시간 배송 추적까지.',
  defaultKeywords: [
    '난방유 배달',
    '등유 배송',
    '경유 배송',
    '당일 배송',
    '정기 배송',
    '난방유 주문',
    '보일러용 경유',
    '실내용 등유',
    '연료 배송',
    '겨울 난방',
    '스타코엑스',
  ],

  // Open Graph 기본값
  og: {
    siteName: '난방유 배달 | 스타코엑스',
    locale: 'ko_KR',
    type: 'website',
  },

  // Twitter Card 기본값
  twitter: {
    card: 'summary_large_image',
    site: '@StarcoEX_Delivery',
    creator: '@StarcoEX_Official',
  },

  // 구조화된 데이터
  structuredData: {
    organization: {
      '@type': 'Organization',
      name: '스타코엑스',
      description: '난방유 배달 전문 서비스',
      url: 'https://fuel-delivery.starcoex.com',
      logo: 'https://fuel-delivery.starcoex.com/images/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+82-1588-9999',
        contactType: 'customer service',
        availableLanguage: 'Korean',
      },
    },
    service: {
      '@type': 'Service',
      name: '난방유 배달 서비스',
      description: '당일 배송 가능한 난방유, 등유, 경유 배송 서비스',
      provider: {
        '@type': 'Organization',
        name: '스타코엑스',
      },
      areaServed: [
        {
          '@type': 'City',
          name: '서울특별시',
        },
        {
          '@type': 'City',
          name: '경기도',
        },
      ],
    },
  },
} as const;

export type SeoConfig = typeof seoConfig;
