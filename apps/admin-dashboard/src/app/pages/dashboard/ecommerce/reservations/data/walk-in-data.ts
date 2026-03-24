export const WALK_IN_STATUS_OPTIONS = [
  { value: 'WAITING', label: '대기 중' },
  { value: 'CALLED', label: '호출됨' },
  { value: 'IN_SERVICE', label: '서비스 중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소됨' },
  { value: 'NO_SHOW', label: '노쇼' },
] as const;

export type WalkInStatusValue =
  (typeof WALK_IN_STATUS_OPTIONS)[number]['value'];

export const WALK_IN_STATUS_CONFIG: Record<
  WalkInStatusValue,
  {
    label: string;
    variant:
      | 'default'
      | 'success'
      | 'warning'
      | 'destructive'
      | 'outline'
      | 'secondary';
  }
> = {
  WAITING: { label: '대기 중', variant: 'warning' },
  CALLED: { label: '호출됨', variant: 'default' },
  IN_SERVICE: { label: '서비스 중', variant: 'success' },
  COMPLETED: { label: '완료', variant: 'outline' },
  CANCELLED: { label: '취소됨', variant: 'secondary' },
  NO_SHOW: { label: '노쇼', variant: 'destructive' },
};
