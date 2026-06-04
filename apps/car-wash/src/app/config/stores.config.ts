/**
 * 🏪 카케어 서비스 지점 설정
 * - 향후 API 응답으로 교체 예정 (현재는 static config)
 */

export type StoreType = 'car-care' | 'gas-station';
export type StoreTag = 'expert' | 'fast-pass' | 'premium' | 'detail';

export interface StoreConfig {
  id: string;
  type: StoreType;
  name: string;
  shortName: string;
  address: string;
  distanceKm?: number; // 런타임에 위치 기반으로 계산
  tags: StoreTag[];

  // UI 표현
  badge: {
    label: string;
    color: 'cyan' | 'amber' | 'green' | 'purple';
  };
  description: string;
  highlights: string[];

  // 운영 정보
  phone: string;
  operatingHours: {
    weekday: string;
    weekend: string;
  };

  // 서비스 가용 여부
  services: {
    speedWash: boolean; // 10분 외부 손세차
    premiumDetail: boolean; // 전문 디테일링
    gasStation: boolean; // 주유 연계
    autoWash: boolean; // 자동 세차기
  };

  // 주유소 연계 특이사항
  gasStationNote?: string;

  // 카케어 전문점 특이사항
  carCareNote?: string;

  // 좌표 (지도 연동용)
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const STORES: StoreConfig[] = [
  {
    id: 'star-gas-station',
    type: 'gas-station',
    name: '별표주유소 세차장',
    shortName: '별표주유소',
    address: '제주특별자치도 제주시 연삼로 12',
    tags: ['fast-pass'],
    badge: {
      label: 'Fast Pass',
      color: 'cyan',
    },
    description: '주유와 동시에 해결하는 초스피드 손세차',
    highlights: ['주유 시 세차 할인 혜택', '자동세차 병행 가능', '24시간 운영'],
    phone: '064-713-2002',
    operatingHours: {
      weekday: '08:00 ~ 20:00',
      weekend: '09:00 ~ 18:00',
    },
    services: {
      speedWash: true,
      premiumDetail: false,
      gasStation: true,
      autoWash: true,
    },
    gasStationNote: '주유 완료 후 세차장 진입 시 주유기 번호를 입력하세요.',
    coordinates: {
      lat: 33.499621,
      lng: 126.531188,
    },
  },
  {
    id: 'jeerage-car-care',
    type: 'car-care',
    name: '제라게 카케어',
    shortName: '제라게',
    address: '제주특별자치도 제주시 노형동 123',
    tags: ['expert', 'premium', 'detail'],
    badge: {
      label: 'Expert Care',
      color: 'amber',
    },
    description: '전문 디테일러의 고퀄리티 손세차 & 케어',
    highlights: [
      '전문 디테일러 상주',
      '실내 세차 추가 가능',
      '코팅 · PPF 시공',
    ],
    phone: '064-000-0000',
    operatingHours: {
      weekday: '09:00 ~ 19:00',
      weekend: '09:00 ~ 17:00',
    },
    services: {
      speedWash: true,
      premiumDetail: true,
      gasStation: false,
      autoWash: false,
    },
    carCareNote: '세차 후 디테일링 상담을 원하시면 직원에게 문의하세요.',
    coordinates: {
      lat: 33.489621,
      lng: 126.481188,
    },
  },
];

/**
 * 지점 ID로 조회
 */
export const getStoreById = (id: string): StoreConfig | undefined =>
  STORES.find((s) => s.id === id);

/**
 * 스피드 세차 가능한 지점만 필터
 */
export const getSpeedWashStores = (): StoreConfig[] =>
  STORES.filter((s) => s.services.speedWash);

/**
 * 프리미엄 디테일링 가능한 지점만 필터
 */
export const getPremiumStores = (): StoreConfig[] =>
  STORES.filter((s) => s.services.premiumDetail);
