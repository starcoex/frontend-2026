import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import type { MonthlyActivityStatsOutput } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: MonthlyActivityStatsOutput | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'value' },
];

export function MonthlyActivityStatsCard({ data, isLoading }: Props) {
  const stats = [
    {
      label: '총 결제액',
      value: data?.totalAmount?.toLocaleString() ?? '0',
      suffix: '원',
      icon: DollarSign,
      color: 'text-blue-500',
    },
    {
      label: '총 절약액',
      value: data?.totalSavings?.toLocaleString() ?? '0',
      suffix: '원',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: '총 이벤트',
      value: data?.totalEvents?.toLocaleString() ?? '0',
      suffix: '건',
      icon: Activity,
      color: 'text-violet-500',
    },
  ];

  const exportData = stats.map((s) => ({
    label: s.label,
    value: `${s.value}${s.suffix}`,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>월별 활동 통계</CardTitle>
            <CardDescription>이번 달 전체 활동 요약</CardDescription>
          </div>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="monthly-activity"
            pdfTitle="월별 활동 통계"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-muted-foreground text-xs">
                    {stat.label}
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  <p className="text-xl font-bold">
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
