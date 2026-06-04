import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { VisitorStatsDetailed } from '@starcoex-frontend/analytics';
import {
  VISITOR_STATS_PERIOD_OPTIONS,
  VisitorStatsPeriod,
} from '@/app/pages/dashboard/board/analytics/data/analytics-data';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: VisitorStatsDetailed | null;
  isLoading: boolean;
  period?: VisitorStatsPeriod;
  onPeriodChange?: (period: VisitorStatsPeriod) => void;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '수', key: 'value' },
];

export function VisitorStatsCard({
  data,
  isLoading,
  period = 7,
  onPeriodChange,
}: Props) {
  const navigate = useNavigate();

  const stats = [
    {
      label: '총 방문자',
      value: data?.totalVisitors?.toLocaleString() ?? '0',
      suffix: '명',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: '신규 방문자',
      value: data?.newVisitors?.toLocaleString() ?? '0',
      suffix: '명',
      icon: UserPlus,
      color: 'text-emerald-500',
    },
    {
      label: '재방문자',
      value: data?.returningVisitors?.toLocaleString() ?? '0',
      suffix: '명',
      icon: RefreshCw,
      color: 'text-violet-500',
    },
  ];

  const exportData = [
    ...stats.map((s) => ({ label: s.label, value: `${s.value}${s.suffix}` })),
    {
      label: '일 평균 방문자',
      value: `${data?.averageVisitorsPerDay?.toLocaleString() ?? '0'}명`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>방문자 통계</CardTitle>
            <CardDescription className="mt-1">
              기간별 방문자 현황
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {/* 기간 선택 */}
            {onPeriodChange && (
              <div className="flex gap-1 rounded-md border p-1">
                {VISITOR_STATS_PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onPeriodChange(opt.value)}
                    className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                      period === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            <ExportButton
              data={exportData}
              columns={EXPORT_COLUMNS}
              fileName="visitor-stats"
              pdfTitle="방문자 통계"
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
        <div className="grid grid-cols-3 gap-4">
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
                  <Skeleton className="mt-1 h-7 w-20" />
                ) : (
                  <p className="mt-1 text-xl font-bold">
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
        {!isLoading && data && (
          <p className="text-muted-foreground mt-3 text-xs">
            일 평균 방문자: {data.averageVisitorsPerDay.toLocaleString()}명
          </p>
        )}
      </CardContent>
    </Card>
  );
}
