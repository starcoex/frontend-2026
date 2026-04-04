import { useMemo } from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Delivery } from '@starcoex-frontend/delivery';

export function DeliveryStats({ deliveries }: { deliveries: Delivery[] }) {
  const stats = useMemo(() => {
    const total = deliveries.length;
    const pending = deliveries.filter((d) => d.status === 'PENDING').length;
    const inTransit = deliveries.filter(
      (d) => d.status === 'IN_TRANSIT' || d.status === 'PICKED_UP'
    ).length;
    const delivered = deliveries.filter((d) => d.status === 'DELIVERED').length;
    const failed = deliveries.filter(
      (d) => d.status === 'FAILED' || d.status === 'CANCELLED'
    ).length;
    const withIssues = deliveries.filter((d) => d.issueReported).length;

    return { total, pending, inTransit, delivered, failed, withIssues };
  }, [deliveries]);

  const statItems = [
    {
      label: '전체 배송',
      value: stats.total.toLocaleString(),
      icon: Truck,
      badge: null,
    },
    {
      label: '배송 완료',
      value: stats.delivered.toLocaleString(),
      icon: CheckCircle,
      badge:
        stats.delivered > 0
          ? { label: '완료', variant: 'outline' as const }
          : null,
    },
    {
      label: '배송 중',
      value: stats.inTransit.toLocaleString(),
      icon: Clock,
      badge:
        stats.inTransit > 0
          ? { label: '진행 중', variant: 'warning' as const }
          : { label: '없음', variant: 'outline' as const },
    },
    {
      label: '대기 중',
      value: stats.pending.toLocaleString(),
      icon: Clock,
      badge:
        stats.pending > 0
          ? { label: '대기', variant: 'warning' as const }
          : { label: '없음', variant: 'outline' as const },
    },
    {
      label: '이슈 발생',
      value: stats.withIssues.toLocaleString(),
      icon: AlertTriangle,
      badge:
        stats.withIssues > 0
          ? { label: '확인 필요', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '실패/취소',
      value: stats.failed.toLocaleString(),
      icon: XCircle,
      badge:
        stats.failed > 0
          ? { label: '처리 필요', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
