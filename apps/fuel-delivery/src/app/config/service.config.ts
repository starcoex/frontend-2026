import React from 'react';
import { Truck, Fuel, Car, Calendar, MapPin, Shield } from 'lucide-react';

export interface ServiceConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  detailDescription: string;
  icon: React.ComponentType<any>;
  href: string;
  color: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  features: string[];
  available: boolean;
  comingSoon?: boolean;
  order: number;
  isExternalApp?: boolean;
  domain?: string;
}

/**
 * 🚛 Fuel Delivery 서비스 설정
 */
export const serviceConfig = {
  // 현재 서비스 (자기 자신)
  currentService: {
    id: 'fuel-delivery',
    name: '난방유 배달',
    shortName: '배달',
    description: '당일 배송 가능한 난방유 주문 서비스',
    detailDescription:
      '서울, 경기 지역 당일 배송 가능한 난방유, 등유, 경유 배송 서비스. 정기 배송 할인과 실시간 배송 추적으로 안전하고 편리하게 이용하세요.',
    icon: Truck,
    href: '/',
    color: {
      primary: '#ea580c', // orange-600
      secondary: '#fb923c', // orange-400
      background: '#fed7aa', // orange-200
      text: '#9a3412', // orange-800
    },
    features: [
      '당일 배송',
      '정기 배송 할인',
      '실시간 배송 추적',
      '안전한 직배송',
      '전화 주문 가능',
      '무료 배송 (조건부)',
    ],
    available: true,
    order: 3,
    isExternalApp: true,
    domain: 'fuels-delivery.starcoex.com',
  } as ServiceConfig,

  // 연계 서비스들
  relatedServices: [
    {
      id: 'gas-station',
      name: '별표주유소',
      shortName: '주유소',
      description: '24시간 실시간 연료 가격 정보',
      detailDescription:
        '전국 주유소의 실시간 유가 정보를 제공합니다. 가장 저렴한 주유소를 찾아보세요.',
      icon: Fuel,
      href: 'https://gas-station.starcoex.com',
      color: {
        primary: '#0ea5e9', // sky-500
        secondary: '#38bdf8', // sky-400
        background: '#bae6fd', // sky-200
        text: '#0c4a6e', // sky-900
      },
      features: ['실시간 가격 정보', '주유소 찾기', '가격 비교', '멤버십 혜택'],
      available: true,
      order: 1,
      isExternalApp: true,
      domain: 'gas-station.starcoex.com',
    },
    {
      id: 'car-wash',
      name: '세차 서비스',
      shortName: '세차',
      description: '전문 세차 및 카케어 예약',
      detailDescription:
        '전문가가 제공하는 고품질 세차 서비스를 온라인으로 예약하세요. 다양한 세차 옵션과 합리적인 가격을 제공합니다.',
      icon: Car,
      href: 'https://car-wash.starcoex.com',
      color: {
        primary: '#8b5cf6', // violet-500
        secondary: '#a78bfa', // violet-400
        background: '#ddd6fe', // violet-200
        text: '#5b21b6', // violet-800
      },
      features: ['온라인 예약', '전문 세차', '카케어 서비스', '합리적 가격'],
      available: true,
      order: 2,
      isExternalApp: true,
      domain: 'car-wash.starcoex.com',
    },
  ] as ServiceConfig[],

  // 서비스 카테고리
  categories: [
    {
      id: 'energy',
      name: '에너지',
      description: '연료 및 에너지 관련 서비스',
      services: ['gas-station', 'fuel-delivery'],
      icon: Fuel,
      color: '#ea580c',
    },
    {
      id: 'automotive',
      name: '자동차',
      description: '자동차 관련 서비스',
      services: ['car-wash'],
      icon: Car,
      color: '#8b5cf6',
    },
    {
      id: 'logistics',
      name: '물류',
      description: '배송 및 물류 서비스',
      services: ['fuel-delivery'],
      icon: Truck,
      color: '#0ea5e9',
    },
  ],

  // 통합 기능
  integration: {
    // 포털 로그인으로 모든 서비스 자동 연결
    autoLogin: true,

    // 통합 적립금/포인트 시스템
    unifiedRewards: {
      enabled: true,
      pointsPerOrder: 100, // 주문 당 기본 포인트
      bonusMultiplier: 1.5, // 정기 배송시 보너스
    },

    // 서비스 간 교차 추천
    crossRecommendation: {
      enabled: true,
      rules: [
        {
          from: 'fuel-delivery',
          to: 'gas-station',
          condition: 'after_delivery',
          message: '주유소에서도 연료를 확인해보세요!',
        },
        {
          from: 'fuel-delivery',
          to: 'car-wash',
          condition: 'regular_customer',
          message: '정기 고객님께 세차 할인 쿠폰을 드려요!',
        },
      ],
    },

    // 알림 설정
    notifications: {
      crossService: true, // 다른 서비스 알림 받기
      promotions: true, // 통합 프로모션 알림
      seasonal: true, // 계절별 서비스 안내
    },
  },

  // 고객 지원
  support: {
    channels: [
      {
        type: 'phone',
        name: '전화 상담',
        value: '1588-9999',
        hours: '평일 08:00-18:00, 주말 09:00-16:00',
        priority: 1,
        available24h: false,
      },
      {
        type: 'kakao',
        name: '카카오톡 상담',
        value: '@starcoex_delivery',
        hours: '평일 09:00-18:00',
        priority: 2,
        available24h: false,
      },
      {
        type: 'email',
        name: '이메일 문의',
        value: 'delivery@starcoex.com',
        hours: '24시간 접수',
        priority: 3,
        available24h: true,
      },
    ],

    // 긴급 상황 대응
    emergency: {
      hotline: '1588-7777',
      available24h: true,
      responseTime: '10분 내',
    },

    // FAQ 카테고리
    faqCategories: [
      '주문 관련',
      '배송 관련',
      '결제 관련',
      '정기 배송',
      '취소/환불',
      '계정 관리',
    ],
  },

  // 앱 특화 기능
  specialFeatures: [
    {
      id: 'same-day-delivery',
      name: '당일 배송',
      description: '오후 2시 전 주문시 당일 배송',
      icon: Calendar,
      enabled: true,
      seasonal: false,
    },
    {
      id: 'area-check',
      name: '배송 지역 확인',
      description: '실시간 배송 가능 지역 조회',
      icon: MapPin,
      enabled: true,
      seasonal: false,
    },
    {
      id: 'bulk-order',
      name: '대량 주문',
      description: '사업장 대량 주문 특별 서비스',
      icon: Truck,
      enabled: true,
      seasonal: false,
    },
    {
      id: 'winter-emergency',
      name: '겨울철 긴급 배송',
      description: '한파 특보시 긴급 배송 서비스',
      icon: Shield,
      enabled: false,
      seasonal: true, // 겨울철에만 활성화
      seasonCondition: 'winter',
    },
  ],

  // 프로모션 설정
  promotions: {
    newCustomer: {
      enabled: true,
      discount: 0.1, // 10% 할인
      description: '신규 가입 고객 첫 주문 10% 할인',
    },

    subscription: {
      enabled: true,
      discounts: {
        weekly: 0.05, // 매주 5%
        biweekly: 0.03, // 격주 3%
        monthly: 0.02, // 매월 2%
      },
      description: '정기 배송 가입시 추가 할인',
    },

    seasonal: {
      winter: {
        enabled: true,
        period: '11-03', // 11월-3월
        discount: 0.05,
        description: '겨울철 성수기 특별 할인',
      },
    },

    bulk: {
      enabled: true,
      tiers: [
        { minAmount: 100000, discount: 0.03 }, // 10만원 이상 3%
        { minAmount: 200000, discount: 0.05 }, // 20만원 이상 5%
        { minAmount: 500000, discount: 0.08 }, // 50만원 이상 8%
      ],
      description: '대량 주문 할인',
    },
  },

  // 품질 보증
  qualityAssurance: {
    deliveryGuarantee: {
      sameDayDelivery: true,
      onTimeRate: 95, // 95% 정시 배송
      compensationPolicy: true,
    },

    productQuality: {
      certifiedSuppliers: true,
      qualityCheck: true,
      returnPolicy: '7일 무조건 환불',
    },

    safety: {
      driverBackground: true, // 기사 신원 확인
      vehicleInspection: true, // 차량 정기 점검
      insuranceCoverage: true, // 배송 보험
    },
  },
} as const;

export type FuelDeliveryServiceConfig = typeof serviceConfig;
