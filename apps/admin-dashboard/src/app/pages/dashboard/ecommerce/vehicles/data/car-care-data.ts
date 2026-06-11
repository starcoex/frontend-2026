import type {
  VehicleBodyTypeValue,
  VehicleSizeGradeValue,
} from './vehicle-data';

// ─── 추가금 타입 ──────────────────────────────────────────────────────────────

export const CAR_CARE_SURCHARGE_TYPE_OPTIONS = [
  { value: 'NO_CARD', label: '카드 미소지', variant: 'warning' },
  { value: 'HIGH_POLLUTION', label: '심한 오염', variant: 'destructive' },
  { value: 'CUSTOM', label: '기타', variant: 'secondary' },
] as const;

export type CarCareSurchargeTypeValue =
  (typeof CAR_CARE_SURCHARGE_TYPE_OPTIONS)[number]['value'];

// ─── 가격 단위 ────────────────────────────────────────────────────────────────

export const CAR_CARE_UNIT_OPTIONS = [
  { value: 'WON', label: '원 (₩)' },
] as const;

export type CarCareUnitValue = (typeof CAR_CARE_UNIT_OPTIONS)[number]['value'];

// ─── 차체 유형 + 사이즈 등급 조합 (가격 매트릭스용) ──────────────────────────

export const PRICE_MATRIX_BODY_TYPES: VehicleBodyTypeValue[] = [
  'PASSENGER',
  'SUV',
  'VAN',
  'TRUCK',
];

export const PRICE_MATRIX_SIZE_GRADES: VehicleSizeGradeValue[] = [
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

export const BODY_TYPE_LABELS: Record<VehicleBodyTypeValue, string> = {
  PASSENGER: '승용',
  SUV: 'SUV',
  VAN: '승합',
  TRUCK: '화물',
};

export const SIZE_GRADE_LABELS: Record<VehicleSizeGradeValue, string> = {
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: '2XL',
};
