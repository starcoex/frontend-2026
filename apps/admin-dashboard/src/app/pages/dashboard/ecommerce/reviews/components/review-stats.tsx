import { MessageSquare, Eye, EyeOff, Flag, Trash2 } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReviewSummaryStats } from '@starcoex-frontend/reviews';

interface ReviewStatsProps {
  stats: ReviewSummaryStats;
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  const statItems = [
    {
      label: '전체 리뷰',
      value: stats.total.toLocaleString(),
      icon: MessageSquare,
      badge: null,
    },
    {
      label: '활성',
      value: stats.active.toLocaleString(),
      icon: Eye,
      badge:
        stats.total > 0
          ? {
              label: `${Math.round((stats.active / stats.total) * 100)}%`,
              variant: 'outline' as const,
            }
          : null,
    },
    {
      label: '숨김',
      value: stats.hidden.toLocaleString(),
      icon: EyeOff,
      badge:
        stats.hidden > 0
          ? { label: '관리 필요', variant: 'warning' as const }
          : null,
    },
    {
      label: '신고됨',
      value: stats.reported.toLocaleString(),
      icon: Flag,
      badge:
        stats.reported > 0
          ? { label: '검토 필요', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '삭제됨',
      value: stats.deleted.toLocaleString(),
      icon: Trash2,
      badge: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
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
