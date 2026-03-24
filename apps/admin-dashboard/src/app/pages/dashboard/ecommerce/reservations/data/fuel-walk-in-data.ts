export const FUEL_WALK_IN_STATUS_OPTIONS = [
  { value: 'WAITING', label: '대기 중' },
  { value: 'PAYMENT_PENDING', label: '결제 대기' },
  { value: 'READY', label: '준비됨' },
  { value: 'IN_SERVICE', label: '주유 중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'PAYMENT_DUE', label: '결제 필요' },
  { value: 'CANCELLED', label: '취소됨' },
  { value: 'REFUND_PENDING', label: '환불 대기' },
] as const;

export type FuelWalkInStatusValue =
  (typeof FUEL_WALK_IN_STATUS_OPTIONS)[number]['value'];

export const FUEL_WALK_IN_STATUS_CONFIG: Record<
  FuelWalkInStatusValue,
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
  PAYMENT_PENDING: { label: '결제 대기', variant: 'warning' },
  READY: { label: '준비됨', variant: 'default' },
  IN_SERVICE: { label: '주유 중', variant: 'success' },
  COMPLETED: { label: '완료', variant: 'outline' },
  PAYMENT_DUE: { label: '결제 필요', variant: 'destructive' },
  CANCELLED: { label: '취소됨', variant: 'secondary' },
  REFUND_PENDING: { label: '환불 대기', variant: 'warning' },
};

export const FUEL_TYPE_LABELS: Record<string, string> = {
  GASOLINE: '휘발유',
  DIESEL: '경유',
  PREMIUM_GASOLINE: '고급 휘발유',
  KEROSENE: '등유',
};

export const FUEL_PAYMENT_TYPE_LABELS: Record<string, string> = {
  CARD_PRE: '카드 선불',
  APP_PRE: '앱 선불',
  CASH_PRE: '현금 선불',
  CARD_POST: '카드 후불',
  CASH_POST: '현금 후불',
  APP_POST: '앱 후불',
};

export const FUEL_PAYMENT_STATUS_CONFIG: Record<
  string,
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
  UNPAID: { label: '미결제', variant: 'warning' },
  PENDING: { label: '처리 중', variant: 'warning' },
  PAID: { label: '결제 완료', variant: 'success' },
  PARTIAL_PAID: { label: '부분 결제', variant: 'default' },
  REFUNDING: { label: '환불 중', variant: 'warning' },
  REFUNDED: { label: '환불 완료', variant: 'outline' },
  FAILED: { label: '결제 실패', variant: 'destructive' },
  CANCELLED: { label: '결제 취소', variant: 'secondary' },
};
