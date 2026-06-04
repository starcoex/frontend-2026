import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminDashboardStatsOutput } from '@starcoex-frontend/analytics';

interface Props {
  listData: any;
  adminStats: AdminDashboardStatsOutput | null;
  isLoading: boolean;
}

export function SalesSummaryCards({ listData, adminStats, isLoading }: Props) {
  const totalRevenue = listData?.totalRevenue ?? 0;
  const totalCount = listData?.totalCount ?? 0;
  const todayRevenue = adminStats?.totalRevenueToday ?? 0;
  const todayOrders = adminStats?.totalOrdersToday ?? 0;

  const cards = [
    {
      label: '총 결제액',
      value: `₩${totalRevenue.toLocaleString()}`,
      trend: 'up' as const,
      percent: null,
      desc: `총 ${totalCount.toLocaleString()}건`,
    },
    {
      label: '오늘 매출',
      value: `₩${todayRevenue.toLocaleString()}`,
      trend: 'up' as const,
      percent: null,
      desc: `오늘 주문 ${todayOrders.toLocaleString()}건`,
    },
    {
      label: '활성 사용자',
      value: `${adminStats?.activeUsersToday?.toLocaleString() ?? 0}명`,
      trend: 'up' as const,
      percent: null,
      desc: `전체 ${adminStats?.totalUsers?.toLocaleString() ?? 0}명`,
    },
    {
      label: '총 주문',
      value: `${adminStats?.totalOrdersToday?.toLocaleString() ?? 0}건`,
      trend: 'up' as const,
      percent: null,
      desc: '오늘 기준',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="space-y-1">
            <CardDescription>{card.label}</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="font-display text-2xl lg:text-3xl">
                  {card.value}
                </div>
                <div className="flex items-center text-xs">
                  {card.trend === 'up' ? (
                    <ArrowUpIcon className="mr-1 size-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="mr-1 size-3 text-red-500" />
                  )}
                  <span className="text-muted-foreground">{card.desc}</span>
                </div>
              </>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
