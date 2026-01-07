import { FuelProductCode } from '../types';

// =============================================================================
// 📍 지역 코드 상수 (오피넷 표준 코드 기준)
// =============================================================================

// 제주특별자치도 코드
export const JEJU_SIDO_CODE = '11';

// 제주도 내 시군구 코드
export const JEJU_SIGUN_CODES = {
  JEJU_CITY: '1101', // 제주시
  SEOGWIPO_CITY: '1102', // 서귀포시
} as const;

// =============================================================================
// ⛽ 주유소 ID 상수
// =============================================================================

// 특정 주유소 ID 관리 (API 호출 시 사용)
export const STATION_IDS = {
  // 별표주유소 (실제 오피넷 ID로 교체 필요, 예시 ID 넣어둠)
  STAR: 'A0031050',
} as const;

// =============================================================================
// 🏷️ 코드 상수 (백엔드 Enum 매핑)
// =============================================================================

// 연료 코드 (백엔드 FuelCode와 일치)
export const FUEL_CODES = {
  GASOLINE: 'B027', // 휘발유
  DIESEL: 'D047', // 경유
  PREMIUM_GASOLINE: 'B034', // 고급휘발유
  KEROSENE: 'C004', // 실내등유
  LPG: 'K015', // LPG
} as const;

// ✅ [추가] 연료 표시 순서 (배열)
export const FUEL_ORDER: FuelProductCode[] = [
  'B034', // 고급휘발유
  'B027', // 휘발유
  'D047', // 경유
  'C004', // 실내등유
  'K015', // LPG
];

// ✅ [추가] 연료 이름 매핑 (객체)
export const FUEL_NAMES: Record<FuelProductCode, string> = {
  B034: '고급휘발유',
  B027: '휘발유',
  D047: '경유',
  C004: '실내등유',
  K015: 'LPG',
};

// 브랜드 코드 (백엔드 BrandCode와 일치)
export const BRAND_CODES = {
  SKE: 'SKE', // SK에너지
  GSC: 'GSC', // GS칼텍스
  HDO: 'HDO', // 현대오일뱅크
  SOL: 'SOL', // S-OIL
  RTE: 'RTE', // 자영알뜰
  RTX: 'RTX', // 고속도로알뜰
  NHO: 'NHO', // 농협알뜰
  ETC: 'ETC', // 자가상표
  ALL: 'ALL', // 전체
} as const;

// 브랜드 코드 타입
export type BrandCodeType = keyof typeof BRAND_CODES;

// 브랜드 표시 순서
export const BRAND_ORDER: BrandCodeType[] = [
  'SKE',
  'GSC',
  'HDO',
  'SOL',
  'RTE',
  'NHO',
  'ETC',
];

// 브랜드 이름 매핑
export const BRAND_NAMES: Record<BrandCodeType, string> = {
  SKE: 'SK에너지',
  GSC: 'GS칼텍스',
  HDO: '현대오일뱅크',
  SOL: 'S-OIL',
  RTE: '자영알뜰',
  RTX: '고속도로알뜰',
  NHO: '농협알뜰',
  ETC: '자가상표',
  ALL: '전체',
};

/**
 * 브랜드 코드로 브랜드명 가져오기
 */
export const getBrandName = (brandCode: string): string => {
  return BRAND_NAMES[brandCode as BrandCodeType] || brandCode;
};

/**
 * 유효한 브랜드 코드인지 확인
 */
export const isValidBrandCode = (code: string): code is BrandCodeType => {
  return Object.keys(BRAND_CODES).includes(code);
};

// =============================================================================
// 🎨 UI 설정 및 헬퍼 함수
// =============================================================================

interface FuelUIConfig {
  name: string;
  color: string;
  bgColor: string;
  description: string;
}

// 연료별 UI 설정 (색상, 이름 등)
export const FUEL_UI_CONFIG: Record<string, FuelUIConfig> = {
  [FUEL_CODES.PREMIUM_GASOLINE]: {
    name: '고급휘발유',
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    description: '고급 휘발유',
  },
  [FUEL_CODES.GASOLINE]: {
    name: '휘발유',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    description: '보통 휘발유',
  },
  [FUEL_CODES.DIESEL]: {
    name: '경유',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    description: '자동차용 경유',
  },
  [FUEL_CODES.KEROSENE]: {
    name: '실내등유',
    color: 'text-slate-600',
    bgColor: 'bg-slate-500',
    description: '난방용 등유',
  },
  [FUEL_CODES.LPG]: {
    name: 'LPG',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    description: '자동차용 부탄',
  },
};

/**
 * 연료 코드를 받아 UI 설정(이름, 색상 등)을 반환하는 헬퍼 함수
 */
export const getFuelUIConfig = (
  fuelCode: string | FuelProductCode
): FuelUIConfig => {
  return (
    FUEL_UI_CONFIG[fuelCode] || {
      name: '기타',
      color: 'text-gray-400',
      bgColor: 'bg-gray-400',
      description: '기타 연료',
    }
  );
};

/**
 * 연료 코드로 연료명 가져오기
 */
export const getFuelName = (fuelCode: string): string => {
  return FUEL_NAMES[fuelCode as FuelProductCode] || fuelCode;
};
