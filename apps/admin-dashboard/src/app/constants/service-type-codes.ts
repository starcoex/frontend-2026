export const SERVICE_TYPE_CODES = {
  FUEL: 'FUEL',
  CAR_WASH: 'CAR_WASH',
  HEATING_OIL: 'HEATING_OIL',
  SINHAN_NETWORKS: 'SINHAN_NETWORKS',
  CAR_CARE: 'CAR_CARE',
  SHADE: 'SHADE',
  CHEMICAL_SALE: 'CHEMICAL_SALE',
} as const;

export type ServiceTypeCode = keyof typeof SERVICE_TYPE_CODES;

export const BUSINESS_TYPE_CODES = {
  STAR_GAS_STATION: 'STAR_GAS_STATION',
  ZERAGAE_CARCARE: 'ZERAGAE_CARCARE',
  SINHAN_NETWORKS: 'SINHAN_NETWORKS',
  METAL_CRAFT: 'METAL_CRAFT',
  CHEMICAL_SALE: 'CHEMICAL_SALE',
} as const;

export type BusinessTypeCode = keyof typeof BUSINESS_TYPE_CODES;

// ─── UI 레이블 매핑 ───────────────────────────────────────────────────────────

export const SERVICE_TYPE_LABELS: Record<ServiceTypeCode, string> = {
  FUEL: '주유',
  CAR_WASH: '세차',
  HEATING_OIL: '난방유 배달',
  SINHAN_NETWORKS: '네트웍스',
  CAR_CARE: '카케어',
  SHADE: '그늘막',
  CHEMICAL_SALE: '케미칼 판매',
};

export const BUSINESS_TYPE_LABELS: Record<BusinessTypeCode, string> = {
  STAR_GAS_STATION: '별표주유소',
  ZERAGAE_CARCARE: '제라게 카케어',
  SINHAN_NETWORKS: '신한 네트웍스',
  METAL_CRAFT: '메탈 크래프트',
  CHEMICAL_SALE: '케미칼 판매',
};

// ─── 선택 목록 (Select/드롭다운용) ───────────────────────────────────────────

export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([code, label]) => ({ code: code as ServiceTypeCode, label })
);

export const BUSINESS_TYPE_OPTIONS = Object.entries(BUSINESS_TYPE_LABELS).map(
  ([code, label]) => ({ code: code as BusinessTypeCode, label })
);
