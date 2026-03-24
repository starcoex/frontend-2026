import { useMemo } from 'react';
import { Clock, Truck, CircleDollarSign, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HeatingOilDelivery } from '@starcoex-frontend/reservations';

export function HeatingOilDeliveryStats({
  deliveries,
}: {
  deliveries: HeatingOilDelivery[];
}) {
  const stats = useMemo(() => {
    const pending = deliveries.filter((d) =>
      ['PENDING', 'CONFIRMED', 'DRIVER_ASSIGNED'].includes(d.status)
    ).length;
    const inProgress = deliveries.filter((d) =>
      ['DISPATCHED', 'ARRIVED'].includes(d.status)
    ).length;
    const totalRevenue = deliveries
      .filter((d) => d.status === 'COMPLETED')
      .reduce((sum, d) => sum + d.paidAmount, 0);
    const urgent = deliveries.filter((d) => d.isUrgent).length;

    return { pending, inProgress, totalRevenue, urgent };
  }, [deliveries]);

  const statItems = [
    {
      label: '처리 대기',
      value: stats.pending,
      icon: Clock,
      badge:
        stats.pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : null,
    },
    {
      label: '배달 중',
      value: stats.inProgress,
      icon: Truck,
      badge:
        stats.inProgress > 0
          ? { label: '진행 중', variant: 'success' as const }
          : null,
    },
    {
      label: '완료 매출',
      value: `₩${stats.totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '긴급 배달',
      value: stats.urgent,
      icon: AlertTriangle,
      badge:
        stats.urgent > 0
          ? { label: '긴급', variant: 'destructive' as const }
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
