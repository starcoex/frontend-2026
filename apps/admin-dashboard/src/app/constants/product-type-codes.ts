export const PRODUCT_TYPE_CODES = {
  GENERAL: 'GENERAL',
  FUEL: 'FUEL',
  HEATING_OIL: 'HEATING_OIL',
  CAR_WASH: 'CAR_WASH',
  CAR_CARE: 'CAR_CARE',
  SINHAN_NETWORKS: 'SINHAN_NETWORKS',
  SHADE: 'SHADE',
} as const;

export type ProductTypeCode = keyof typeof PRODUCT_TYPE_CODES;

export const PRODUCT_TYPE_LABELS: Record<ProductTypeCode, string> = {
  GENERAL: '일반상품',
  FUEL: '유류',
  HEATING_OIL: '난방유',
  CAR_WASH: '세차',
  CAR_CARE: '카케어',
  SINHAN_NETWORKS: '네트웍스',
  SHADE: '그늘막',
};

/** SKU 접두사 — ProductType별 식별 코드 */
export const PRODUCT_TYPE_SKU_PREFIX: Record<ProductTypeCode, string> = {
  GENERAL: 'GEN',
  FUEL: 'FUEL',
  HEATING_OIL: 'HOL',
  CAR_WASH: 'CW',
  CAR_CARE: 'CC',
  SINHAN_NETWORKS: 'NET',
  SHADE: 'SHD',
};

export const PRODUCT_TYPE_OPTIONS = Object.entries(PRODUCT_TYPE_LABELS).map(
  ([code, label]) => ({ code: code as ProductTypeCode, label })
);

/** FUEL 타입 유종 목록 */
export const FUEL_TYPE_OPTIONS = [
  { value: 'GASOLINE', label: '휘발유' },
  { value: 'DIESEL', label: '경유' },
  { value: 'LPG', label: 'LPG' },
  { value: 'PREMIUM_GASOLINE', label: '고급 휘발유' },
  { value: 'KEROSENE', label: '등유' },
] as const;

export type FuelTypeValue = (typeof FUEL_TYPE_OPTIONS)[number]['value'];

/** FUEL 타입별 SKU 접두사 */
export const FUEL_TYPE_SKU_PREFIX: Record<string, string> = {
  GASOLINE: 'GSL',
  DIESEL: 'DSL',
  LPG: 'LPG',
  PREMIUM_GASOLINE: 'PGS',
  KEROSENE: 'KRS',
};

/** metadata 입력이 필요한 ProductType 코드 목록 */
export const PRODUCT_TYPES_WITH_METADATA: ProductTypeCode[] = ['FUEL'];

/** ServiceType 코드 매핑 (논리적 연결, FK 없음) */
export const PRODUCT_TYPE_TO_SERVICE_TYPE: Partial<
  Record<ProductTypeCode, string>
> = {
  FUEL: 'FUEL',
  HEATING_OIL: 'HEATING_OIL',
  CAR_WASH: 'CAR_WASH',
  CAR_CARE: 'CAR_CARE',
  SINHAN_NETWORKS: 'SINHAN_NETWORKS',
  SHADE: 'SHADE',
};
