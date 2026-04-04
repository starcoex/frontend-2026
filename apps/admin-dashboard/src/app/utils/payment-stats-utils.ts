import { format, eachDayOfInterval, parseISO, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Payment } from '@starcoex-frontend/payments';
import { PaymentStatus } from '@starcoex-frontend/payments';

// 일별 결제 집계 데이터 타입
export interface DailyChartData {
  date: string; // "MM/dd"
  fullDate: string; // "yyyy-MM-dd"
  amount: number; // 결제 완료 금액 합계
  count: number; // 결제 건수
  cancelledAmount: number;
}

// 상태별 분포 타입
export interface StatusChartData {
  name: string;
  value: number;
  color: string;
}

export const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PAID]: '#22c55e',
  [PaymentStatus.PENDING]: '#f59e0b',
  [PaymentStatus.FAILED]: '#ef4444',
  [PaymentStatus.CANCELLED]: '#6b7280',
  [PaymentStatus.PARTIAL_CANCELLED]: '#8b5cf6',
};

// 일별 집계
export function buildDailyChartData(
  payments: Payment[],
  startDate: string,
  endDate: string
): DailyChartData[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayPayments = payments.filter((p) => {
      const pDate = p.paidAt ?? p.createdAt;
      return format(startOfDay(parseISO(pDate)), 'yyyy-MM-dd') === dayStr;
    });

    const amount = dayPayments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + p.amount, 0);

    const cancelledAmount = dayPayments
      .filter((p) =>
        [PaymentStatus.CANCELLED, PaymentStatus.PARTIAL_CANCELLED].includes(
          p.status
        )
      )
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      date: format(day, 'MM/dd', { locale: ko }),
      fullDate: dayStr,
      amount,
      count: dayPayments.length,
      cancelledAmount,
    };
  });
}

// 상태별 분포
export function buildStatusChartData(payments: Payment[]): StatusChartData[] {
  const counts: Partial<Record<PaymentStatus, number>> = {};

  payments.forEach((p) => {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  });

  const STATUS_LABELS: Record<PaymentStatus, string> = {
    [PaymentStatus.PAID]: '결제 완료',
    [PaymentStatus.PENDING]: '결제 대기',
    [PaymentStatus.FAILED]: '결제 실패',
    [PaymentStatus.CANCELLED]: '전액 취소',
    [PaymentStatus.PARTIAL_CANCELLED]: '부분 취소',
  };

  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([status, value]) => ({
      name: STATUS_LABELS[status as PaymentStatus],
      value: value as number,
      color: STATUS_COLORS[status as PaymentStatus],
    }));
}

// 요약 통계
export function buildSummaryStats(payments: Payment[]) {
  const paid = payments.filter((p) => p.status === PaymentStatus.PAID);
  const cancelled = payments.filter((p) =>
    [PaymentStatus.CANCELLED, PaymentStatus.PARTIAL_CANCELLED].includes(
      p.status
    )
  );
  const failed = payments.filter((p) => p.status === PaymentStatus.FAILED);

  const totalPaidAmount = paid.reduce((sum, p) => sum + p.amount, 0);
  const totalCancelledAmount = cancelled.reduce((sum, p) => sum + p.amount, 0);
  const cancelRate =
    payments.length > 0
      ? ((cancelled.length / payments.length) * 100).toFixed(1)
      : '0.0';

  return {
    totalCount: payments.length,
    paidCount: paid.length,
    cancelledCount: cancelled.length,
    failedCount: failed.length,
    totalPaidAmount,
    totalCancelledAmount,
    cancelRate,
  };
}
