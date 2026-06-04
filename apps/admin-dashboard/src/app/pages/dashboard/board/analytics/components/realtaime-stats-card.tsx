import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import type { RealtimeStatsOutput } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: RealtimeStatsOutput | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'value' },
];

export function RealtimeStatsCard({ data, isLoading }: Props) {
  const stats = [
    {
      label: '총 절약액',
      value: data?.totalSavings?.toLocaleString() ?? '0',
      suffix: '원',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: '총 결제 금액',
      value: data?.totalAmount?.toLocaleString() ?? '0',
      suffix: '원',
      icon: DollarSign,
      color: 'text-blue-500',
    },
    {
      label: '총 주문 수',
      value: data?.totalOrders?.toLocaleString() ?? '0',
      suffix: '건',
      icon: ShoppingCart,
      color: 'text-violet-500',
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
            <CardTitle>실시간 통계</CardTitle>
            <CardDescription>현재까지 누적 통계</CardDescription>
          </div>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="realtime-stats"
            pdfTitle="실시간 통계"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-muted-foreground text-xs">
                    {stat.label}
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-7 w-20" />
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
