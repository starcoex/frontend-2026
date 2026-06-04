import { useNavigate } from 'react-router-dom';
import { TrendingUp, Activity, DollarSign, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { PersonalStatsOutput } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: PersonalStatsOutput | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'value' },
];

export function PersonalStatsCard({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const stats = [
    {
      label: '총 절약액',
      value: data?.totalSavings?.toLocaleString() ?? '0',
      suffix: '원',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: '총 사용액',
      value: data?.totalAmount?.toLocaleString() ?? '0',
      suffix: '원',
      icon: DollarSign,
      color: 'text-blue-500',
    },
    {
      label: '총 이벤트',
      value: data?.totalEvents?.toLocaleString() ?? '0',
      suffix: '건',
      icon: Activity,
      color: 'text-violet-500',
    },
    {
      label: '마지막 서비스',
      value: data?.lastService ?? '-',
      suffix: '',
      icon: Calendar,
      color: 'text-orange-500',
    },
  ];

  const exportData = stats.map((s) => ({
    label: s.label,
    value: `${s.value}${s.suffix}`,
  }));

  return (
    <div className="space-y-2">
      {/* 헤더 행 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">개인 통계</p>
        <div className="flex items-center gap-1">
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="personal-stats"
            pdfTitle="개인 통계"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => navigate('/admin/analytics/overview')}
          >
            전체보기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-muted-foreground ml-1 text-sm font-normal">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
