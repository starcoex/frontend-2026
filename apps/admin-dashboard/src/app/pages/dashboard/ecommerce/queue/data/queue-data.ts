import { QueueSessionStatus } from '@starcoex-frontend/queue';

export const QUEUE_STATUS_OPTIONS = [
  { value: QueueSessionStatus.WAITING, label: '대기 중', variant: 'secondary' },
  { value: QueueSessionStatus.CALLED, label: '호출됨', variant: 'warning' },
  {
    value: QueueSessionStatus.IN_SERVICE,
    label: '서비스 중',
    variant: 'default',
  },
  { value: QueueSessionStatus.COMPLETED, label: '완료', variant: 'success' },
  {
    value: QueueSessionStatus.CANCELLED,
    label: '취소',
    variant: 'destructive',
  },
  { value: QueueSessionStatus.NO_SHOW, label: '노쇼', variant: 'outline' },
] as const;

export type QueueStatusValue = (typeof QUEUE_STATUS_OPTIONS)[number]['value'];

export const QUEUE_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'position_asc', label: '순번 낮은순' },
  { value: 'position_desc', label: '순번 높은순' },
] as const;

export type QueueSortValue = (typeof QUEUE_SORT_OPTIONS)[number]['value'];

export const QUEUE_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: QueueSessionStatus.WAITING, label: '대기 중' },
  { value: QueueSessionStatus.CALLED, label: '호출됨' },
  { value: QueueSessionStatus.IN_SERVICE, label: '서비스 중' },
  { value: QueueSessionStatus.COMPLETED, label: '완료' },
  { value: QueueSessionStatus.CANCELLED, label: '취소' },
] as const;

export type QueueTabValue = (typeof QUEUE_TAB_OPTIONS)[number]['value'];
