import { useMemo } from 'react';
import { Clock, PhoneCall, CheckCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { WalkIn } from '@starcoex-frontend/reservations';

export function WalkInStats({ walkIns }: { walkIns: WalkIn[] }) {
  const stats = useMemo(() => {
    const waiting = walkIns.filter((w) => w.status === 'WAITING').length;
    const inService = walkIns.filter((w) =>
      ['CALLED', 'IN_SERVICE'].includes(w.status)
    ).length;
    const completed = walkIns.filter((w) => w.status === 'COMPLETED').length;
    const cancelled = walkIns.filter((w) =>
      ['CANCELLED', 'NO_SHOW'].includes(w.status)
    ).length;
    const avgWait =
      walkIns
        .filter((w) => w.estimatedWaitMinutes != null)
        .reduce((sum, w) => sum + (w.estimatedWaitMinutes ?? 0), 0) /
      (walkIns.filter((w) => w.estimatedWaitMinutes != null).length || 1);

    return { waiting, inService, completed, cancelled, avgWait };
  }, [walkIns]);

  const statItems = [
    {
      label: '대기 중',
      value: stats.waiting,
      icon: Clock,
      badge:
        stats.waiting > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : null,
    },
    {
      label: '서비스 중',
      value: stats.inService,
      icon: PhoneCall,
      badge:
        stats.inService > 0
          ? { label: '진행 중', variant: 'success' as const }
          : null,
    },
    {
      label: '완료',
      value: stats.completed,
      icon: CheckCircle,
      badge: null,
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
