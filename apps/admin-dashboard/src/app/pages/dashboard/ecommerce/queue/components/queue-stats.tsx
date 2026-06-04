import { Users, Clock, CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { QueueStats } from '@starcoex-frontend/queue';

export function QueueStatsBar({ stats }: { stats: QueueStats[] }) {
  const totalWaiting = stats.reduce((s, q) => s + q.waitingCount, 0);
  const openCount = stats.filter((q) => q.isOpen).length;
  const avgWait = stats.length
    ? Math.round(
        stats.reduce((s, q) => s + q.estimatedWaitMin, 0) / stats.length
      )
    : 0;
  const todayTotal = stats.reduce((s, q) => s + q.todayTotal, 0);

  const items = [
    {
      label: '전체 대기',
      value: totalWaiting,
      icon: Users,
      badge:
        totalWaiting > 0
          ? { label: '대기 중', variant: 'warning' as const }
          : null,
    },
    {
      label: '운영 중인 지점',
      value: `${openCount}개`,
      icon: CheckCircle2,
      badge: null,
    },
    {
      label: '평균 대기 시간',
      value: `${avgWait}분`,
      icon: Clock,
      badge: null,
    },
    {
      label: '오늘 총 접수',
      value: todayTotal,
      icon: XCircle,
      badge: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <item.icon className="size-4 opacity-60" />
              {item.label}
            </CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">
              {item.value}
            </CardTitle>
            {item.badge && (
              <CardAction>
                <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
