import { FileText, Send, Clock, Archive } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Notice } from '@starcoex-frontend/notices';

export function NoticeStats({ notices }: { notices: Notice[] }) {
  const total = notices.length;
  const published = notices.filter((n) => n.status === 'PUBLISHED').length;
  const scheduled = notices.filter((n) => n.status === 'SCHEDULED').length;
  const archived = notices.filter((n) => n.status === 'ARCHIVED').length;

  const stats = [
    {
      label: '전체 공지',
      value: total,
      icon: FileText,
      badge: null,
    },
    {
      label: '발행됨',
      value: published,
      icon: Send,
      badge:
        published > 0 ? { label: '활성', variant: 'success' as const } : null,
    },
    {
      label: '예약됨',
      value: scheduled,
      icon: Clock,
      badge:
        scheduled > 0 ? { label: '대기', variant: 'warning' as const } : null,
    },
    {
      label: '종료됨',
      value: archived,
      icon: Archive,
      badge: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
