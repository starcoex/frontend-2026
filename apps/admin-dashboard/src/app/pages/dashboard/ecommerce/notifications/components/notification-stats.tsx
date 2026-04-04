import { useMemo } from 'react';
import { Bell, BellOff, Mail, Archive } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NotificationStatsOutput } from '@starcoex-frontend/notifications';

interface NotificationStatsProps {
  stats: NotificationStatsOutput | null;
  unreadCount: number;
}

export function NotificationStats({
  stats,
  unreadCount,
}: NotificationStatsProps) {
  const statItems = useMemo(
    () => [
      {
        label: '전체 알림',
        value: stats?.total ?? 0,
        icon: Bell,
        badge: null,
      },
      {
        label: '읽지 않음',
        value: unreadCount,
        icon: BellOff,
        badge:
          unreadCount > 0
            ? { label: '확인 필요', variant: 'destructive' as const }
            : { label: '없음', variant: 'outline' as const },
      },
      {
        label: '읽음',
        value: stats?.read ?? 0,
        icon: Mail,
        badge: null,
      },
      {
        label: '보관됨',
        value: stats?.archived ?? 0,
        icon: Archive,
        badge: null,
      },
    ],
    [stats, unreadCount]
  );

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
              {stat.value.toLocaleString()}
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
