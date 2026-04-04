export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: '낮음' },
  { value: 'NORMAL', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'URGENT', label: '긴급' },
] as const;

export const SOURCE_TYPE_OPTIONS = [
  { value: 'order', label: '주문' },
  { value: 'reservation', label: '예약' },
  { value: 'manual', label: '수기 입력' },
] as const;

/** 매장 서비스 타입별 수량 단위 레이블 */
export const STORE_QUANTITY_UNIT: Record<string, string> = {
  FUEL: 'L (리터)',
  GENERAL: 'kg',
  CAR_WASH: '건',
  CAR_CARE: '건',
  SINHAN_NETWORKS: '건',
  SHADE: '건',
  HEATING_OIL: 'L (리터)',
};

export const DEFAULT_QUANTITY_UNIT = 'kg';
