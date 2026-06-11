import type { VehicleBodyType, VehicleSizeGrade } from '../types';

// ============================================================================
// 차체 유형
// ============================================================================

export const VEHICLE_BODY_TYPES: Record<VehicleBodyType, string> = {
  PASSENGER: '🚗 승용',
  SUV: '🚙 SUV',
  VAN: '🚐 승합',
  TRUCK: '🚚 화물/트럭',
};

export const VEHICLE_BODY_TYPE_ORDER: VehicleBodyType[] = [
  'PASSENGER',
  'SUV',
  'VAN',
  'TRUCK',
];

// ============================================================================
// 사이즈 등급 (소낙스 기준)
// ============================================================================

export const VEHICLE_SIZE_GRADES: Record<VehicleSizeGrade, string> = {
  S: 'S 등급 (소형)',
  M: 'M 등급 (중형)',
  L: 'L 등급 (대형)',
  XL: 'XL 등급',
  XXL: '2XL 등급',
};

export const VEHICLE_SIZE_GRADE_ORDER: VehicleSizeGrade[] = [
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

// ============================================================================
// 세차 추가금 타입
// ============================================================================

export const CAR_CARE_SURCHARGE_TYPES: Record<string, string> = {
  NO_CARD: '카드 미소지',
  HIGH_POLLUTION: '심한 오염',
  CUSTOM: '기타',
};

// ============================================================================
// 세차 단위
// ============================================================================

export const CAR_CARE_UNITS = {
  WON: 'WON',
} as const;

export type CarCareUnit = keyof typeof CAR_CARE_UNITS;
