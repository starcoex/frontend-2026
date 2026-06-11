// ─── 차량 상태 ────────────────────────────────────────────────────────────────

export const VEHICLE_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '정상', variant: 'success' },
  {
    value: 'PENDING_VERIFICATION',
    label: '등급 결정 대기',
    variant: 'warning',
  },
  { value: 'MANUAL_REVIEW', label: '관리자 검토 필요', variant: 'warning' },
  { value: 'API_ERROR', label: 'API 오류', variant: 'destructive' },
  { value: 'INACTIVE', label: '비활성', variant: 'secondary' },
] as const;

export type VehicleStatusValue =
  (typeof VEHICLE_STATUS_OPTIONS)[number]['value'];

// ─── 차체 유형 ────────────────────────────────────────────────────────────────

export const VEHICLE_BODY_TYPE_OPTIONS = [
  { value: 'PASSENGER', label: '🚗 승용' },
  { value: 'SUV', label: '🚙 SUV' },
  { value: 'VAN', label: '🚐 승합' },
  { value: 'TRUCK', label: '🚚 화물/트럭' },
] as const;

export type VehicleBodyTypeValue =
  (typeof VEHICLE_BODY_TYPE_OPTIONS)[number]['value'];

// ─── 사이즈 등급 ──────────────────────────────────────────────────────────────

export const VEHICLE_SIZE_GRADE_OPTIONS = [
  { value: 'S', label: 'S 등급 (소형)', color: 'bg-blue-100 text-blue-800' },
  { value: 'M', label: 'M 등급 (중형)', color: 'bg-green-100 text-green-800' },
  {
    value: 'L',
    label: 'L 등급 (대형)',
    color: 'bg-yellow-100 text-yellow-800',
  },
  { value: 'XL', label: 'XL 등급', color: 'bg-orange-100 text-orange-800' },
  { value: 'XXL', label: '2XL 등급', color: 'bg-red-100 text-red-800' },
] as const;

export type VehicleSizeGradeValue =
  (typeof VEHICLE_SIZE_GRADE_OPTIONS)[number]['value'];

// ─── 데이터 소스 ──────────────────────────────────────────────────────────────

export const VEHICLE_DATA_SOURCE_OPTIONS = [
  { value: 'API_AUTO', label: 'API 자동 수집' },
  { value: 'API_MANUAL', label: 'API + 관리자 보정' },
  { value: 'ADMIN_API', label: '관리자 API 등록' },
  { value: 'ADMIN_MANUAL', label: '관리자 직접 입력' },
] as const;

export type VehicleDataSourceValue =
  (typeof VEHICLE_DATA_SOURCE_OPTIONS)[number]['value'];

// ─── 등급 신뢰도 ──────────────────────────────────────────────────────────────

export const GRADE_CONFIDENCE_OPTIONS = [
  { value: 'HIGH', label: '높음 (차명 매칭)', variant: 'success' },
  { value: 'MEDIUM', label: '보통 (치수 산출)', variant: 'warning' },
  { value: 'LOW', label: '낮음 (폴백)', variant: 'secondary' },
  { value: 'NONE', label: '수동 검토 필요', variant: 'destructive' },
] as const;

export type GradeConfidenceValue =
  (typeof GRADE_CONFIDENCE_OPTIONS)[number]['value'];

// ─── 등급 출처 ────────────────────────────────────────────────────────────────

export const GRADE_SOURCE_OPTIONS = [
  { value: 'MODEL_MATCH', label: '차명 매칭' },
  { value: 'DIMENSION', label: '차체 치수 산출' },
  { value: 'CLASS_FALLBACK', label: '차종분류명 폴백' },
  { value: 'MANUAL', label: '관리자 수동 지정' },
] as const;

export type GradeSourceValue = (typeof GRADE_SOURCE_OPTIONS)[number]['value'];

// ─── 탭 필터 ─────────────────────────────────────────────────────────────────

export const VEHICLE_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'ACTIVE', label: '정상' },
  { value: 'PENDING_VERIFICATION', label: '등급 대기' },
  { value: 'MANUAL_REVIEW', label: '검토 필요' },
  { value: 'API_ERROR', label: 'API 오류' },
  { value: 'INACTIVE', label: '비활성' },
] as const;

export type VehicleTabValue = (typeof VEHICLE_TAB_OPTIONS)[number]['value'];
