import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyticsSummaryStats } from '@starcoex-frontend/analytics';

interface Props {
  data: AnalyticsSummaryStats | null;
  isLoading: boolean;
}

const ITEMS: {
  key: keyof AnalyticsSummaryStats;
  label: string;
  suffix: string;
}[] = [
  { key: 'totalUsers', label: '전체 사용자', suffix: '명' },
  { key: 'activeUsersToday', label: '오늘 활성', suffix: '명' },
  { key: 'activeUsersThisMonth', label: '이번달 활성', suffix: '명' },
  { key: 'totalActivities', label: '전체 활동', suffix: '건' },
  { key: 'todayActivities', label: '오늘 활동', suffix: '건' },
  { key: 'totalRevenue', label: '총 매출', suffix: '원' },
  { key: 'todayRevenue', label: '오늘 매출', suffix: '원' },
  { key: 'totalSavings', label: '총 절약액', suffix: '원' },
];

export function OverviewAnalyticsSummary({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>플랫폼 요약</CardTitle>
        <CardDescription>전체 플랫폼 누적 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {ITEMS.map((item) => (
            <div key={item.key} className="rounded-md border p-3">
              <p className="text-muted-foreground mb-1 text-xs">{item.label}</p>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <p className="text-lg font-bold">
                  {(data?.[item.key] as number)?.toLocaleString() ?? '0'}
                  <span className="text-muted-foreground ml-0.5 text-xs font-normal">
                    {item.suffix}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
