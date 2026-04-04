import { useMemo } from 'react';
import { Clock, Fuel, CircleDollarSign, XCircle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FuelWalkIn } from '@starcoex-frontend/reservations';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'outline'
  | 'secondary';

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ElementType;
  badge: { label: string; variant: BadgeVariant } | null;
}

export function FuelWalkInStats({
  fuelWalkIns,
}: {
  fuelWalkIns: FuelWalkIn[];
}) {
  const stats = useMemo(() => {
    const waiting = fuelWalkIns.filter((f) =>
      ['WAITING', 'PAYMENT_PENDING', 'READY'].includes(f.status)
    ).length;
    const inService = fuelWalkIns.filter(
      (f) => f.status === 'IN_SERVICE'
    ).length;
    const paidCount = fuelWalkIns.filter((f) => f.paymentConfirmed).length;
    const cancelled = fuelWalkIns.filter((f) =>
      ['CANCELLED', 'REFUND_PENDING'].includes(f.status)
    ).length;

    return { waiting, inService, paidCount, cancelled };
  }, [fuelWalkIns]);

  const statItems: StatItem[] = [
    {
      label: '대기 / 준비',
      value: stats.waiting,
      icon: Clock,
      badge:
        stats.waiting > 0 ? { label: '처리 필요', variant: 'warning' } : null,
    },
    {
      label: '주유 중',
      value: stats.inService,
      icon: Fuel,
      badge:
        stats.inService > 0 ? { label: '진행 중', variant: 'success' } : null,
    },
    {
      label: '결제 완료',
      value: stats.paidCount,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '취소 / 환불',
      value: stats.cancelled,
      icon: XCircle,
      badge:
        stats.cancelled > 0
          ? { label: '확인 필요', variant: 'destructive' }
          : { label: '정상', variant: 'outline' },
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
