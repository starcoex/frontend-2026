import React, { useMemo } from 'react';
import { CalendarCheck, Clock, XCircle, CircleDollarSign } from 'lucide-react';
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
    const paidCount = reservations.filter((r) => r.paymentConfirmed).length;

    return { confirmed, pending, cancelled, paidCount };
  }, [reservations]);

  const statItems: StatItem[] = [
    {
      label: '결제 완료',
      value: stats.paidCount,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '확정 예약',
      value: stats.confirmed,
      icon: CalendarCheck,
      badge:
        stats.confirmed > 0 ? { label: '진행 중', variant: 'success' } : null,
    },
    {
      label: '대기 중',
      value: stats.pending,
      icon: Clock,
      badge:
        stats.pending > 0 ? { label: '처리 필요', variant: 'warning' } : null,
    },
    {
      label: '취소 / 노쇼',
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
