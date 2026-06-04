export interface StoreUIMeta {
  badge: { label: string; color: 'amber' | 'cyan' };
  services: string[];
  note: string;
  description: string; // Store 타입에 없으므로 여기서 관리
  highlights: string[];
  operatingHours: { weekday: string; weekend: string };
  phone?: string;
  address?: string;
  distanceKm?: number;
  type?: 'car-care' | 'gas-station';
  gasStationNote?: string;
  carCareNote?: string;
}

export const STORE_UI_META: Record<number, StoreUIMeta> = {
  1: {
    badge: { label: 'Expert Care', color: 'amber' },
    description: '전문 디테일링 · 코팅 · PPF',
    services: ['💎 프리미엄 디테일링', '⚡ 스피드 세차', '🛡️ PPF'],
    note: '사전 예약 시 대기 없이 입장',
    highlights: ['전문 디테일러 상주', '도막 보호 코팅', '내외부 크리닝'],
    operatingHours: { weekday: '09:00 ~ 20:00', weekend: '09:00 ~ 18:00' },
    phone: '064-000-0001',
    address: '제주 서귀포시 제라게로 1',
    type: 'car-care',
    carCareNote: '사전 예약 시 대기 없이 입장 가능합니다.',
  },
  2: {
    badge: { label: 'Fast Pass', color: 'cyan' },
    description: '주유 후 10분 손세차 연계',
    services: ['⚡ 스피드 세차', '⛽ 주유 연계 할인'],
    note: '주유 결제 시 세차 슬롯 자동 배정',
    highlights: ['주유 연계 자동 배정', '10분 완성', '무인 접수 가능'],
    operatingHours: { weekday: '07:00 ~ 22:00', weekend: '08:00 ~ 20:00' },
    phone: '064-000-0002',
    address: '제주 서귀포시 별표로 2',
    type: 'gas-station',
    gasStationNote: '주유 결제 시 세차 슬롯이 자동으로 배정됩니다.',
  },
};
