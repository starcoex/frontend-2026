import { BRAND_COLORS, BRAND_NAMES, StationBrand } from './brand-constants.js';

/**
 * 브랜드 관련 유틸리티 함수들
 */

/**
 * 브랜드 색상 가져오기
 */
export function getBrandColor(brandCode: string): string {
  const defaultColor =
    'bg-gray-50 dark:bg-gray-950/30 text-gray-700 dark:text-gray-400';

  if (isValidStationBrand(brandCode)) {
    return BRAND_COLORS[brandCode];
  }

  return defaultColor;
}

/**
 * 브랜드명 가져오기
 */
export function getBrandName(brandCode: string): string {
  if (isValidStationBrand(brandCode)) {
    return BRAND_NAMES[brandCode];
  }

  return brandCode;
}

/**
 * 브랜드 코드 유효성 검사
 */
export function isValidStationBrand(code: string): code is StationBrand {
  return (Object.keys(BRAND_NAMES) as StationBrand[]).includes(
    code as StationBrand
  );
}
