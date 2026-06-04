import { MessageSquare, Clock, CheckCircle, Archive } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChatRoomSummaryStats } from '@starcoex-frontend/chats';

export function ChatStats({ stats }: { stats: ChatRoomSummaryStats }) {
  const statItems = [
    {
      label: '전체 채팅방',
      value: stats.total,
      icon: MessageSquare,
      badge: null,
    },
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
      label: '진행 중',
      value: stats.inProgress,
      icon: CheckCircle,
      badge: null,
    },
    {
      label: '보관됨',
      value: stats.archived,
      icon: Archive,
      badge: null,
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
