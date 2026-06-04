// ─── 공지 상태 ────────────────────────────────────────────────────────────────
export const NOTICE_STATUS_OPTIONS = [
  { value: 'DRAFT', label: '초안', variant: 'secondary' },
  { value: 'SCHEDULED', label: '예약됨', variant: 'warning' },
  { value: 'PUBLISHED', label: '발행됨', variant: 'success' },
  { value: 'ARCHIVED', label: '종료됨', variant: 'outline' },
] as const;

export type NoticeStatusValue = (typeof NOTICE_STATUS_OPTIONS)[number]['value'];

// ─── 공지 타입 ────────────────────────────────────────────────────────────────
export const NOTICE_TYPE_OPTIONS = [
  { value: 'GENERAL', label: '일반', variant: 'secondary' },
  { value: 'IMPORTANT', label: '중요', variant: 'default' },
  { value: 'MAINTENANCE', label: '점검', variant: 'warning' },
  { value: 'EVENT', label: '이벤트', variant: 'success' },
  { value: 'URGENT', label: '긴급', variant: 'destructive' },
] as const;

export type NoticeTypeValue = (typeof NOTICE_TYPE_OPTIONS)[number]['value'];

// ─── 매뉴얼 상태 ─────────────────────────────────────────────────────────────
export const MANUAL_STATUS_OPTIONS = [
  { value: 'DRAFT', label: '초안', variant: 'secondary' },
  { value: 'PUBLISHED', label: '발행됨', variant: 'success' },
  { value: 'ARCHIVED', label: '종료됨', variant: 'outline' },
] as const;

export type ManualStatusValue = (typeof MANUAL_STATUS_OPTIONS)[number]['value'];

// ─── 탭 필터 (공지) ──────────────────────────────────────────────────────────
export const NOTICE_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'DRAFT', label: '초안' },
  { value: 'SCHEDULED', label: '예약됨' },
  { value: 'PUBLISHED', label: '발행됨' },
  { value: 'ARCHIVED', label: '종료됨' },
] as const;

export type NoticeTabValue = (typeof NOTICE_TAB_OPTIONS)[number]['value'];

// ─── 탭 필터 (매뉴얼) ────────────────────────────────────────────────────────
export const MANUAL_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'DRAFT', label: '초안' },
  { value: 'PUBLISHED', label: '발행됨' },
  { value: 'ARCHIVED', label: '종료됨' },
] as const;

export type ManualTabValue = (typeof MANUAL_TAB_OPTIONS)[number]['value'];

// ─── 공지 타입 아이콘 ─────────────────────────────────────────────────────────
export const NOTICE_TYPE_ICONS: Record<NoticeTypeValue, string> = {
  GENERAL: '📢',
  IMPORTANT: '⚠️',
  MAINTENANCE: '🔧',
  EVENT: '🎉',
  URGENT: '🚨',
};

// 빠른 조회 Map
export const NOTICE_STATUS_MAP = Object.fromEntries(
  NOTICE_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<NoticeStatusValue, (typeof NOTICE_STATUS_OPTIONS)[number]>;

export const NOTICE_TYPE_MAP = Object.fromEntries(
  NOTICE_TYPE_OPTIONS.map((o) => [o.value, o])
) as Record<NoticeTypeValue, (typeof NOTICE_TYPE_OPTIONS)[number]>;

export const MANUAL_STATUS_MAP = Object.fromEntries(
  MANUAL_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<ManualStatusValue, (typeof MANUAL_STATUS_OPTIONS)[number]>;
