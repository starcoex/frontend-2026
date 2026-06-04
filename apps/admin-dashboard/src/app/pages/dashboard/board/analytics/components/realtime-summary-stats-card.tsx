import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Users, Key } from 'lucide-react';
import type { RealtimeSummaryStats } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: RealtimeSummaryStats | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'value' },
];

export function RealtimeSummaryStatsCard({ data, isLoading }: Props) {
  const stats = [
    {
      label: '리더보드 참여자',
      value: data?.totalUsersInLeaderboard?.toLocaleString() ?? '0',
      suffix: '명',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: '이번 달 참여자',
      value: data?.totalMonthlyUsers?.toLocaleString() ?? '0',
      suffix: '명',
      icon: Users,
      color: 'text-violet-500',
    },
    {
      label: '1위 점수',
      value: data?.top1Score?.toLocaleString() ?? '0',
      suffix: '점',
      icon: Trophy,
      color: 'text-yellow-500',
    },
    {
      label: '3위 점수',
      value: data?.top3Score?.toLocaleString() ?? '0',
      suffix: '점',
      icon: Trophy,
      color: 'text-orange-500',
    },
    {
      label: '활성 Redis 키',
      value: data?.activeRedisKeys?.toLocaleString() ?? '0',
      suffix: '개',
      icon: Key,
      color: 'text-slate-500',
    },
  ];

  const exportData = stats.map((s) => ({
    label: s.label,
    value: `${s.value}${s.suffix}`,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>실시간 요약</CardTitle>
            <CardDescription>리더보드 실시간 집계 현황</CardDescription>
          </div>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="realtime-summary"
            pdfTitle="실시간 요약 통계"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-md border p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-muted-foreground text-xs">
                    {stat.label}
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="mt-1 h-6 w-16" />
                ) : (
                  <p className="mt-1 text-lg font-bold">
                    {stat.value}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      {stat.suffix}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
