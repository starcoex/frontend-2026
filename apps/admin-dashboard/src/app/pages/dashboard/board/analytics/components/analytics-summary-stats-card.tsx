import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyticsSummaryStats } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: AnalyticsSummaryStats | null;
  isLoading: boolean;
}

const STAT_ROWS: {
  key: keyof AnalyticsSummaryStats;
  label: string;
  suffix: string;
}[] = [
  { key: 'totalUsers', label: '전체 사용자', suffix: '명' },
  { key: 'activeUsersToday', label: '오늘 활성 사용자', suffix: '명' },
  { key: 'activeUsersThisMonth', label: '이번 달 활성', suffix: '명' },
  { key: 'totalActivities', label: '전체 활동', suffix: '건' },
  { key: 'todayActivities', label: '오늘 활동', suffix: '건' },
  { key: 'deletedActivities', label: '삭제된 활동', suffix: '건' },
  { key: 'totalRevenue', label: '총 매출', suffix: '원' },
  { key: 'todayRevenue', label: '오늘 매출', suffix: '원' },
  { key: 'totalSavings', label: '총 절약액', suffix: '원' },
];

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'value' },
];

export function AnalyticsSummaryStatsCard({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const exportData = STAT_ROWS.map((row) => ({
    label: row.label,
    value: `${(data?.[row.key] as number)?.toLocaleString() ?? '0'}${
      row.suffix
    }`,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>분석 요약 통계</CardTitle>
            <CardDescription>전체 플랫폼 집계 현황</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <ExportButton
              data={exportData}
              columns={EXPORT_COLUMNS}
              fileName="analytics-summary"
              pdfTitle="분석 요약 통계"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => navigate('/admin/analytics/admin')}
            >
              상세보기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_ROWS.map((row) => (
            <div key={row.key} className="rounded-md border p-3">
              <p className="text-muted-foreground mb-1 text-xs">{row.label}</p>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="text-lg font-bold">
                  {(data?.[row.key] as number)?.toLocaleString() ?? '0'}
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
                    {row.suffix}
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
