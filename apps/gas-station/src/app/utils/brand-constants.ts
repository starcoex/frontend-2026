/**
 * 브랜드 관련 상수들
 */
import * as React from 'react';
import { Building2, Car, Fuel, Truck } from 'lucide-react';

export type StationBrand =
  | 'SKE'
  | 'GSC'
  | 'HDO'
  | 'SOL'
  | 'E1G'
  | 'SKG'
  | 'RTX'
  | 'ETC';

// 브랜드별 색상 - 인덱스 시그니처 사용
export const BRAND_COLORS = {
  SKE: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  GSC: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  HDO: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  SOL: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
  E1G: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400',
  SKG: 'bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400',
  RTX: 'bg-gray-50 dark:bg-gray-950/30 text-gray-700 dark:text-gray-400',
  ETC: 'bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400',
} satisfies Record<StationBrand, string>;

// 브랜드명 매핑 - 인덱스 시그니처 사용
export const BRAND_NAMES = {
  SKE: 'SK에너지',
  GSC: 'GS칼텍스',
  HDO: '현대오일뱅크',
  SOL: 'S-OIL',
  E1G: 'E1',
  SKG: 'SK가스',
  RTX: '자영알뜰',
  ETC: '기타',
} satisfies Record<StationBrand, string>;

/**
 * 스타코엑스 브랜드 및 서비스 관련 상수들
 */

/**
 * 스타코엑스 서비스 인터페이스
 */
export interface StarcoexService {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>; // string에서 React 컴포넌트로 변경
  category: 'fuel' | 'wash' | 'delivery' | 'main';
  status: 'active' | 'coming-soon' | 'maintenance';
  external?: boolean;
}

/**
 * 스타코엑스 서비스 목록
 */
export const STARCOEX_SERVICES: StarcoexService[] = [
  {
    id: 'gas-station',
    title: '별표주유소',
    description: '제주도 주유소 가격 정보 및 주유 서비스',
    href: 'https://gas.starcoex.com',
    icon: Fuel, // 실제 React 컴포넌트 사용
    category: 'fuel',
    status: 'active',
    external: true,
  },
  {
    id: 'car-wash',
    title: '세차 서비스',
    description: '프리미엄 세차 및 차량 관리 서비스',
    href: 'https://wash.starcoex.com',
    icon: Car, // 실제 React 컴포넌트 사용
    category: 'wash',
    status: 'active',
    external: true,
  },
  {
    id: 'fuel-delivery',
    title: '연료 배송',
    description: '주문형 연료 배송 및 현장 주유 서비스',
    href: 'https://delivery.starcoex.com',
    icon: Truck, // 실제 React 컴포넌트 사용
    category: 'delivery',
    status: 'active',
    external: true,
  },
  {
    id: 'starcoex-main',
    title: '스타코엑스 메인',
    description: '통합 플랫폼 및 기업 정보',
    href: 'https://starcoex.com',
    icon: Building2, // 실제 React 컴포넌트 사용
    category: 'main',
    status: 'active',
    external: true,
  },
];

/**
 * 카테고리별 서비스 그룹
 */
export const SERVICES_BY_CATEGORY = {
  fuel: STARCOEX_SERVICES.filter((service) => service.category === 'fuel'),
  wash: STARCOEX_SERVICES.filter((service) => service.category === 'wash'),
  delivery: STARCOEX_SERVICES.filter(
    (service) => service.category === 'delivery'
  ),
  main: STARCOEX_SERVICES.filter((service) => service.category === 'main'),
};

/**
 * 활성 서비스만 필터링
 */
export const ACTIVE_SERVICES = STARCOEX_SERVICES.filter(
  (service) => service.status === 'active'
);

/**
 * 서비스 상태별 그룹
 */
export const SERVICES_BY_STATUS = {
  active: STARCOEX_SERVICES.filter((service) => service.status === 'active'),
  'coming-soon': STARCOEX_SERVICES.filter(
    (service) => service.status === 'coming-soon'
  ),
  maintenance: STARCOEX_SERVICES.filter(
    (service) => service.status === 'maintenance'
  ),
};
