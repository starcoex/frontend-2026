import { useMemo } from 'react';
import { CreditCard, CircleDollarSign, XCircle, Clock } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Payment, PaymentListData } from '@starcoex-frontend/payments';
import { PaymentStatus } from '@starcoex-frontend/payments';
import { formatAmount } from '../data/payment-data';

interface PaymentStatsProps {
  payments: Payment[];
  listData: PaymentListData | null;
}

export function PaymentStats({ payments, listData }: PaymentStatsProps) {
  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === PaymentStatus.PAID).length;
    const pending = payments.filter(
      (p) => p.status === PaymentStatus.PENDING
    ).length;
    const cancelled = payments.filter((p) =>
      [PaymentStatus.CANCELLED, PaymentStatus.PARTIAL_CANCELLED].includes(
        p.status
      )
    ).length;

    return { paid, pending, cancelled };
  }, [payments]);

  const statItems = [
    {
      label: '총 결제 건수',
      value: listData?.total ?? payments.length,
      icon: CreditCard,
      badge: null,
    },
    {
      label: '결제 완료 총액',
      value: formatAmount(listData?.totalPaidAmount ?? 0),
      icon: CircleDollarSign,
      badge:
        stats.paid > 0
          ? { label: `${stats.paid}건`, variant: 'success' as const }
          : null,
    },
    {
      label: '취소 총액',
      value: formatAmount(listData?.totalCancelledAmount ?? 0),
      icon: XCircle,
      badge:
        stats.cancelled > 0
          ? { label: `${stats.cancelled}건`, variant: 'destructive' as const }
          : { label: '없음', variant: 'outline' as const },
    },
    {
      label: '결제 대기',
      value: stats.pending,
      icon: Clock,
      badge:
        stats.pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : { label: '정상', variant: 'outline' as const },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <stat.icon className="size-4 opacity-60" />
              {stat.label}
            </CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">
              {stat.value}
            </CardTitle>
            {stat.badge && (
              <CardAction>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
