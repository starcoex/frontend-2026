import { useMemo } from 'react';
import { CalendarCheck, CircleDollarSign, Clock, XCircle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Reservation } from '@starcoex-frontend/reservations';

interface ReservationStatsProps {
  reservations: Reservation[];
}

export function ReservationStats({ reservations }: ReservationStatsProps) {
  const stats = useMemo(() => {
    const confirmed = reservations.filter((r) =>
      ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'].includes(r.status)
    ).length;
    const pending = reservations.filter((r) =>
      ['PAYMENT_PENDING', 'PENDING_APPROVAL'].includes(r.status)
    ).length;
    const cancelled = reservations.filter((r) =>
      ['CANCELLED', 'NO_SHOW'].includes(r.status)
    ).length;
    const totalRevenue = reservations
      .filter((r) => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.paidAmount, 0);

    return { confirmed, pending, cancelled, totalRevenue };
  }, [reservations]);

  const statItems = [
    {
      label: '완료 매출',
      value: `₩${stats.totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '확정 예약',
      value: stats.confirmed,
      icon: CalendarCheck,
      badge:
        stats.confirmed > 0
          ? { label: '진행 중', variant: 'success' as const }
          : null,
    },
    {
      label: '대기 중',
      value: stats.pending,
      icon: Clock,
      badge:
        stats.pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : null,
    },
    {
      label: '취소 / 노쇼',
      value: stats.cancelled,
      icon: XCircle,
      badge:
        stats.cancelled > 0
          ? { label: '확인 필요', variant: 'destructive' as const }
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
