// ─── 문의 상태 ────────────────────────────────────────────────────────────────

export const CONTACT_STATUS_OPTIONS = [
  { value: 'PENDING', label: '접수 대기', variant: 'secondary' },
  { value: 'IN_PROGRESS', label: '처리 중', variant: 'warning' },
  { value: 'RESOLVED', label: '처리 완료', variant: 'success' },
  { value: 'CLOSED', label: '종료', variant: 'outline' },
] as const;

export type ContactStatusValue =
  (typeof CONTACT_STATUS_OPTIONS)[number]['value'];

// ─── 문의 카테고리 ────────────────────────────────────────────────────────────

export const CONTACT_CATEGORY_OPTIONS = [
  { value: 'GENERAL', label: '일반 문의' },
  { value: 'TECHNICAL', label: '기술 지원' },
  { value: 'PAYMENT', label: '결제 문의' },
  { value: 'PARTNERSHIP', label: '제휴/파트너십' },
  { value: 'COMPLAINT', label: '불만/민원' },
  { value: 'ETC', label: '기타' },
] as const;

export type ContactCategoryValue =
  (typeof CONTACT_CATEGORY_OPTIONS)[number]['value'];

// ─── 문의자 유형 ──────────────────────────────────────────────────────────────

export const CONTACT_USER_TYPE_OPTIONS = [
  { value: 'MEMBER', label: '회원' },
  { value: 'GUEST', label: '비회원' },
] as const;

export type ContactUserTypeValue =
  (typeof CONTACT_USER_TYPE_OPTIONS)[number]['value'];

// ─── 탭 필터 ─────────────────────────────────────────────────────────────────

export const CONTACT_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'PENDING', label: '접수 대기' },
  { value: 'IN_PROGRESS', label: '처리 중' },
  { value: 'RESOLVED', label: '처리 완료' },
  { value: 'CLOSED', label: '종료' },
] as const;

export type ContactTabValue = (typeof CONTACT_TAB_OPTIONS)[number]['value'];

// ─── 상태 전이 맵 ─────────────────────────────────────────────────────────────

export const NEXT_CONTACT_STATUS_MAP: Record<
  ContactStatusValue,
  ContactStatusValue[]
> = {
  PENDING: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
};

// ─── 카테고리 레이블 맵 ───────────────────────────────────────────────────────

export const CONTACT_CATEGORY_LABEL: Record<ContactCategoryValue, string> = {
  GENERAL: '일반 문의',
  TECHNICAL: '기술 지원',
  PAYMENT: '결제 문의',
  PARTNERSHIP: '제휴/파트너십',
  COMPLAINT: '불만/민원',
  ETC: '기타',
};
