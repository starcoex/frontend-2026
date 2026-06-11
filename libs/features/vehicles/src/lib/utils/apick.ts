import type { ApickCheckType } from '../types';

// ============================================================================
// Apick 검색 타입
// ============================================================================

export const APICK_CHECK_TYPES: Record<ApickCheckType, string> = {
  VIN: '차대번호',
  CAR_NUMBER: '차량번호',
};

// ============================================================================
// Apick 서비스 종류
// ============================================================================

export const APICK_SERVICES = {
  FLOOD: 'flood',
  SCRAP: 'scrap',
  SALE: 'sale',
} as const;

export type ApickServiceType =
  (typeof APICK_SERVICES)[keyof typeof APICK_SERVICES];

export const APICK_SERVICE_LABELS: Record<ApickServiceType, string> = {
  flood: '🌊 침수차 조회',
  scrap: '🔧 폐차사고처리 조회',
  sale: '🏷️ 매매용 차량 조회',
};

// ============================================================================
// 결과 코드
// ============================================================================

/** result: 0 = 이상 없음, 1 = 해당 차량 */
export const APICK_RESULT_LABELS: Record<number, string> = {
  0: '이상 없음',
  1: '해당 차량',
};

export const APICK_RESULT_VARIANTS: Record<
  number,
  'success' | 'destructive' | 'secondary'
> = {
  0: 'success',
  1: 'destructive',
};

// ============================================================================
// 기본 페이징
// ============================================================================

export const APICK_DEFAULT_PAGE_SIZE = 20;
