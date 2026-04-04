export const RESERVATION_STATUS_OPTIONS = [
  { value: 'PAYMENT_PENDING', label: '결제 대기' },
  { value: 'PAYMENT_FAILED', label: '결제 실패' },
  { value: 'PAYMENT_EXPIRED', label: '결제 만료' },
  { value: 'PENDING_APPROVAL', label: '승인 대기' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'CHECKED_IN', label: '체크인' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'NO_SHOW', label: '노쇼' },
  { value: 'CANCELLED', label: '취소됨' },
  { value: 'REFUND_REQUESTED', label: '환불 요청' },
  { value: 'REFUND_PROCESSING', label: '환불 처리 중' },
  { value: 'REFUNDED', label: '환불 완료' },
  { value: 'PARTIAL_REFUNDED', label: '부분 환불' },
] as const;

export type ReservationStatusValue =
  (typeof RESERVATION_STATUS_OPTIONS)[number]['value'];

export const RESERVATION_STATUS_CONFIG: Record<
  ReservationStatusValue,
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
  PAYMENT_PENDING: { label: '결제 대기', variant: 'warning' },
  PAYMENT_FAILED: { label: '결제 실패', variant: 'destructive' },
  PAYMENT_EXPIRED: { label: '결제 만료', variant: 'destructive' },
  PENDING_APPROVAL: { label: '승인 대기', variant: 'warning' },
  CONFIRMED: { label: '확정', variant: 'success' },
  CHECKED_IN: { label: '체크인', variant: 'success' },
  IN_PROGRESS: { label: '진행 중', variant: 'default' },
  COMPLETED: { label: '완료', variant: 'outline' },
  NO_SHOW: { label: '노쇼', variant: 'destructive' },
  CANCELLED: { label: '취소됨', variant: 'secondary' },
  REFUND_REQUESTED: { label: '환불 요청', variant: 'warning' },
  REFUND_PROCESSING: { label: '환불 처리 중', variant: 'warning' },
  REFUNDED: { label: '환불 완료', variant: 'outline' },
  PARTIAL_REFUNDED: { label: '부분 환불', variant: 'outline' },
};

export const RESERVATION_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'reservedDate_asc', label: '예약일 오름차순' },
  { value: 'reservedDate_desc', label: '예약일 내림차순' },
] as const;
