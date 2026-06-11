// ─── 검색 타입 ────────────────────────────────────────────────────────────────

export const APICK_CHECK_TYPE_OPTIONS = [
  { value: 'CAR_NUMBER', label: '차량번호' },
  { value: 'VIN', label: '차대번호' },
] as const;

export type ApickCheckTypeValue =
  (typeof APICK_CHECK_TYPE_OPTIONS)[number]['value'];

// ─── 서비스 타입 ──────────────────────────────────────────────────────────────

export const APICK_SERVICE_OPTIONS = [
  { value: 'flood', label: '🌊 침수차 조회' },
  { value: 'scrap', label: '🔧 폐차사고처리 조회' },
  { value: 'sale', label: '🏷️ 매매용 차량 조회' },
] as const;

export type ApickServiceValue = (typeof APICK_SERVICE_OPTIONS)[number]['value'];

// ─── 조회 결과 ────────────────────────────────────────────────────────────────

export const APICK_RESULT_CONFIG: Record<
  number,
  { label: string; variant: 'success' | 'destructive' | 'secondary' }
> = {
  0: { label: '이상 없음', variant: 'success' },
  1: { label: '해당 차량', variant: 'destructive' },
};

// ─── 탭 옵션 (이력 페이지용) ──────────────────────────────────────────────────

export const APICK_HISTORY_TAB_OPTIONS = [
  { value: 'flood', label: '침수차' },
  { value: 'scrap', label: '폐차사고처리' },
  { value: 'sale', label: '매매용 차량' },
] as const;

export type ApickHistoryTabValue =
  (typeof APICK_HISTORY_TAB_OPTIONS)[number]['value'];

// ─── 기본 페이지 설정 ─────────────────────────────────────────────────────────

export const APICK_DEFAULT_PAGE = 1;
export const APICK_DEFAULT_LIMIT = 20;
