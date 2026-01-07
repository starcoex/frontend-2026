import { Car, Fuel, Truck, ShieldCheck } from 'lucide-react';
import React from 'react';

export interface ServiceConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  detailDescription: string;
  icon: React.ComponentType<any>;
  href: string; // 서비스 상세 페이지 경로
  appHref?: string; // 실제 앱 URL (새로 추가)
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
  isExternalApp?: boolean; // 독립 앱 여부
  domain?: string; // 독립 도메인
  // 전용 앱의 특별한 점을 위한 추가 필드
  appBenefits?: string[];
  appImage?: string;
  whyUseApp?: string;
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: 'gas-station',
    name: '별표주유소',
    shortName: '주유소',
    description: '믿을 수 있는 연료와 최고의 서비스',
    detailDescription:
      '24시간 운영하는 별표주유소에서 최고 품질의 연료와 함께 편리한 부대서비스를 제공합니다. 독립 앱에서 더욱 편리하게 이용하세요.',
    icon: Fuel,
    href: 'https://gas-station.starcoex.com', // 독립 앱의 소개/홈 페이지
    appHref: 'https://gas-station.starcoex.com/app', // 독립 앱의 실제 기능
    color: {
      primary: 'text-[hsl(var(--service-gas-station))]',
      secondary: 'text-[hsl(var(--service-gas-station)/0.8)]',
      background:
        'bg-[hsl(var(--service-gas-station)/0.1)] dark:bg-[hsl(var(--service-gas-station)/0.2)]',
      text: 'text-[hsl(var(--service-gas-station))] dark:text-[hsl(var(--service-gas-station)/0.9)]',
    },
    features: [
      '24시간 운영',
      '고품질 연료',
      '간편 소셜 로그인',
      '실시간 가격 비교',
      '주유소 찾기',
    ],
    available: true,
    isExternalApp: true,
    domain: 'gas-station.starcoex.com',
    order: 1,
    whyUseApp:
      '전용 앱에서만 제공되는 실시간 주유소 현황과 즉석 할인혜택을 놓치지 마세요!',
    appBenefits: [
      '앱 전용 할인 쿠폰',
      '실시간 주유소 혼잡도',
      '푸시 알림으로 특가 정보',
      '주유 이력 자동 관리',
    ],
    appImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: 'fuel-delivery',
    name: '난방유 배달',
    shortName: '난방유',
    description: '집까지 배달하는 난방유 서비스',
    detailDescription:
      '추운 겨울, 따뜻한 우리 집을 위한 난방유를 안전하고 빠르게 배달해드립니다. 전용 앱에서 간편하게 주문하세요.',
    icon: Truck,
    href: 'https://fuel-delivery.starcoex.com', // 독립 앱의 소개/홈 페이지
    appHref: 'https://fuel-delivery.starcoex.com/app', // 독립 앱의 실제 기능
    color: {
      primary: 'text-[hsl(var(--service-fuels-delivery))]',
      secondary: 'text-[hsl(var(--service-fuels-delivery)/0.8)]',
      background:
        'bg-[hsl(var(--service-fuels-delivery)/0.1)] dark:bg-[hsl(var(--service-fuels-delivery)/0.2)]',
      text: 'text-[hsl(var(--service-fuels-delivery))] dark:text-[hsl(var(--service-fuels-delivery)/0.9)]',
    },
    features: [
      '당일 배송',
      '정기 배송',
      '간편 주문',
      '실시간 배송 추적',
      '소셜 로그인',
    ],
    available: true,
    isExternalApp: true,
    domain: 'fuels-delivery.starcoex.com',
    order: 2,
    whyUseApp:
      '전용 앱으로 배송기사와 실시간 소통하며 정확한 배송 시간을 확인하세요!',
    appBenefits: [
      '배송기사 실시간 위치',
      '앱에서 간편 재주문',
      '정기배송 스케줄 관리',
      '날씨 알림과 배송 추천',
    ],
    appImage:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: 'car-wash',
    name: '세차 서비스',
    shortName: '세차',
    description: '전문적이고 꼼꼼한 세차',
    detailDescription:
      '전문 장비와 숙련된 기술자가 제공하는 프리미엄 세차 서비스입니다. 전용 앱에서 예약부터 결제까지 한번에!',
    icon: Car,
    href: 'https://car-wash.starcoex.com', // 독립 앱의 소개/홈 페이지
    appHref: 'https://car-wash.starcoex.com/app', // 독립 앱의 실제 기능
    color: {
      primary: 'text-[hsl(var(--service-car-wash))]',
      secondary: 'text-[hsl(var(--service-car-wash)/0.8)]',
      background:
        'bg-[hsl(var(--service-car-wash)/0.1)] dark:bg-[hsl(var(--service-car-wash)/0.2)]',
      text: 'text-[hsl(var(--service-car-wash))] dark:text-[hsl(var(--service-car-wash)/0.9)]',
    },
    features: [
      '온라인 예약',
      '간편 결제',
      '실시간 진행상황',
      '방문/매장 세차',
      '소셜 로그인',
    ],
    available: true,
    isExternalApp: true,
    domain: 'car-wash.starcoex.com',
    order: 3,
    whyUseApp:
      '전용 앱에서만 가능한 세차 과정 실시간 확인과 완료 사진을 받아보세요!',
    appBenefits: [
      '세차 전후 비교 사진',
      '실시간 작업 진행상황',
      '멤버십 포인트 적립',
      '예약 변경 및 취소 자유',
    ],
    appImage:
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: 'zeragae-care',
    name: '제라게 카케어',
    shortName: '카케어',
    description: '프리미엄 카케어 솔루션',
    detailDescription:
      '독일 소낙스 정품을 사용한 전문 카케어 서비스로 차량을 새것처럼 관리해드립니다. 곧 전용 앱으로 만나보세요!',
    icon: ShieldCheck,
    href: 'https://zeragae-care.starcoex.com', // 독립 앱의 소개/홈 페이지 (출시 예정)
    appHref: 'https://zeragae-care.starcoex.com/app', // 독립 앱의 실제 기능 (출시 예정)
    color: {
      primary: 'text-[hsl(var(--service-zeragae-care))]',
      secondary: 'text-[hsl(var(--service-zeragae-care)/0.8)]',
      background:
        'bg-[hsl(var(--service-zeragae-care)/0.1)] dark:bg-[hsl(var(--service-zeragae-care)/0.2)]',
      text: 'text-[hsl(var(--service-zeragae-care))] dark:text-[hsl(var(--service-zeragae-care)/0.9)]',
    },
    features: [
      '세라믹 코팅',
      '광택 서비스',
      '보호필름',
      '실내 코팅',
      '정기 관리',
    ],
    available: true,
    comingSoon: false,
    isExternalApp: true,
    domain: 'zeragae-care.starcoex.com',
    order: 4,
    whyUseApp:
      '전용 앱에서 코팅 진행상황과 차량 상태를 실시간으로 모니터링하고 관리 일정을 받아보세요!',
    appBenefits: [
      '코팅 과정 실시간 영상',
      '차량 상태 정기 리포트',
      'VIP 예약 우선권',
      '전문가 1:1 상담',
    ],
    appImage:
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop&auto=format',
  },
];

// 유틸리티 함수들
export const getServiceById = (id: string): ServiceConfig | undefined => {
  return SERVICES_CONFIG.find((service) => service.id === id);
};

export const getAvailableServices = (): ServiceConfig[] => {
  return SERVICES_CONFIG.filter((service) => service.available).sort(
    (a, b) => a.order - b.order
  );
};

export const getComingSoonServices = (): ServiceConfig[] => {
  return SERVICES_CONFIG.filter((service) => service.comingSoon).sort(
    (a, b) => a.order - b.order
  );
};

export const getExternalServices = (): ServiceConfig[] => {
  return SERVICES_CONFIG.filter((service) => service.isExternalApp).sort(
    (a, b) => a.order - b.order
  );
};

export const getInternalServices = (): ServiceConfig[] => {
  return SERVICES_CONFIG.filter((service) => !service.isExternalApp).sort(
    (a, b) => a.order - b.order
  );
};
