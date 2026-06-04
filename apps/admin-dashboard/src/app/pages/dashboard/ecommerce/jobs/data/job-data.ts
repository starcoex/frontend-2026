// ─── 공고 상태 ────────────────────────────────────────────────────────────────
export const JOB_STATUS_OPTIONS = [
  { value: 'DRAFT', label: '초안', variant: 'secondary' },
  { value: 'OPEN', label: '모집중', variant: 'success' },
  { value: 'CLOSED', label: '마감', variant: 'outline' },
  { value: 'CANCELLED', label: '취소', variant: 'destructive' },
] as const;

export type JobStatusValue = (typeof JOB_STATUS_OPTIONS)[number]['value'];

// ─── 고용 형태 ────────────────────────────────────────────────────────────────
export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: '정규직', variant: 'default' },
  { value: 'PART_TIME', label: '파트타임', variant: 'secondary' },
  { value: 'CONTRACT', label: '계약직', variant: 'outline' },
  { value: 'INTERNSHIP', label: '인턴', variant: 'outline' },
  { value: 'FREELANCE', label: '프리랜서', variant: 'outline' },
] as const;

export type EmploymentTypeValue =
  (typeof EMPLOYMENT_TYPE_OPTIONS)[number]['value'];

// ─── 지원서 상태 ──────────────────────────────────────────────────────────────
export const JOB_APPLICATION_STATUS_OPTIONS = [
  { value: 'PENDING', label: '검토 대기', variant: 'secondary' },
  { value: 'REVIEWING', label: '검토중', variant: 'warning' },
  { value: 'PASSED', label: '합격', variant: 'success' },
  { value: 'REJECTED', label: '불합격', variant: 'destructive' },
  { value: 'CANCELLED', label: '취소', variant: 'outline' },
] as const;

export type JobApplicationStatusValue =
  (typeof JOB_APPLICATION_STATUS_OPTIONS)[number]['value'];

// ✅ 누락된 Map 추가
export const JOB_APPLICATION_STATUS_MAP = Object.fromEntries(
  JOB_APPLICATION_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<
  JobApplicationStatusValue,
  (typeof JOB_APPLICATION_STATUS_OPTIONS)[number]
>;

// ─── 정렬 ────────────────────────────────────────────────────────────────────
export const JOB_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'endDate_asc', label: '마감 임박순' },
  { value: 'applicationCount_desc', label: '지원자 많은순' },
] as const;

export type JobSortValue = (typeof JOB_SORT_OPTIONS)[number]['value'];

// ─── 탭 필터 ─────────────────────────────────────────────────────────────────
export const JOB_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'DRAFT', label: '초안' },
  { value: 'OPEN', label: '모집중' },
  { value: 'CLOSED', label: '마감' },
  { value: 'CANCELLED', label: '취소' },
] as const;

export type JobTabValue = (typeof JOB_TAB_OPTIONS)[number]['value'];

// ─── 상태 Map (빠른 조회용) ──────────────────────────────────────────────────
export const JOB_STATUS_MAP = Object.fromEntries(
  JOB_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<JobStatusValue, (typeof JOB_STATUS_OPTIONS)[number]>;

export const EMPLOYMENT_TYPE_MAP = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((o) => [o.value, o])
) as Record<EmploymentTypeValue, (typeof EMPLOYMENT_TYPE_OPTIONS)[number]>;

// ─── D-day 계산 유틸 ──────────────────────────────────────────────────────────
export function calcDday(endDate?: string | null): string {
  if (!endDate) return '상시';
  const diff = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-day';
  return `D-${diff}`;
}

// ─── 공고 상태 → 다음 전이 가능 상태 맵 ─────────────────────────────────────
export const NEXT_JOB_STATUS_MAP: Record<JobStatusValue, JobStatusValue[]> = {
  DRAFT: ['OPEN', 'CANCELLED'],
  OPEN: ['CLOSED', 'CANCELLED'],
  CLOSED: ['OPEN'], // 재오픈 가능
  CANCELLED: [],
};
