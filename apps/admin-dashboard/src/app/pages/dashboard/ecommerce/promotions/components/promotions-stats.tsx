import { useMemo } from 'react';
import { Tag, PlayCircle, PauseCircle, FileText } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PromotionSummaryStats } from '@starcoex-frontend/promotions';

interface PromotionsStatsProps {
  stats: PromotionSummaryStats | null;
}

export function PromotionsStats({ stats }: PromotionsStatsProps) {
  const statItems = useMemo(() => {
    const statusCounts = stats?.statusCounts ?? [];
    const getCount = (status: string) =>
      statusCounts.find((s) => s.status === status)?.count ?? 0;

    return [
      {
        label: '전체 프로모션',
        value: statusCounts.reduce((sum, s) => sum + s.count, 0),
        icon: Tag,
        badge: null,
      },
      {
        label: '활성',
        value: getCount('ACTIVE'),
        icon: PlayCircle,
        badge:
          getCount('ACTIVE') > 0
            ? { label: '운영 중', variant: 'default' as const }
            : null,
      },
      {
        label: '일시 정지',
        value: getCount('PAUSED'),
        icon: PauseCircle,
        badge:
          getCount('PAUSED') > 0
            ? { label: '정지됨', variant: 'secondary' as const }
            : null,
      },
      {
        label: '초안',
        value: getCount('DRAFT'),
        icon: FileText,
        badge: null,
      },
    ];
  }, [stats]);

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
