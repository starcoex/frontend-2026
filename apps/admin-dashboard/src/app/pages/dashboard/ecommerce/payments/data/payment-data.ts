import { PaymentStatus, CancellationStatus } from '@starcoex-frontend/payments';

// Badge variant 타입 (shadcn/ui Badge 기준)
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; variant: BadgeVariant }
> = {
  [PaymentStatus.PENDING]: { label: '결제 대기', variant: 'warning' },
  [PaymentStatus.PAID]: { label: '결제 완료', variant: 'success' },
  [PaymentStatus.FAILED]: { label: '결제 실패', variant: 'destructive' },
  [PaymentStatus.CANCELLED]: { label: '전액 취소', variant: 'secondary' },
  [PaymentStatus.PARTIAL_CANCELLED]: { label: '부분 취소', variant: 'outline' },
};

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_CONFIG).map(
  ([value, { label }]) => ({ value, label })
);

export const CANCELLATION_STATUS_CONFIG: Record<
  CancellationStatus,
  { label: string; variant: BadgeVariant }
> = {
  [CancellationStatus.PENDING]: { label: '취소 요청 중', variant: 'warning' },
  [CancellationStatus.SUCCEEDED]: { label: '취소 완료', variant: 'success' },
  [CancellationStatus.FAILED]: { label: '취소 실패', variant: 'destructive' },
};

export const formatAmount = (amount: number, currency = 'KRW'): string => {
  if (currency === 'KRW') return `₩${amount.toLocaleString()}`;
  return `${amount.toLocaleString()} ${currency}`;
};
