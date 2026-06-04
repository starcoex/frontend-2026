import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminDashboardStatsOutput } from '@starcoex-frontend/analytics';

interface Props {
  adminStats: AdminDashboardStatsOutput | null;
  paymentsListData: any;
  isLoading: boolean;
}

export function OverviewKpiCards({
  adminStats,
  paymentsListData,
  isLoading,
}: Props) {
  const cards = [
    {
      label: '오늘 매출',
      value: `₩${(adminStats?.totalRevenueToday ?? 0).toLocaleString()}`,
      sub: `총 ₩${(paymentsListData?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-500',
    },
    {
      label: '오늘 주문',
      value: `${(adminStats?.totalOrdersToday ?? 0).toLocaleString()}건`,
      sub: '오늘 기준',
      icon: ShoppingCart,
      color: 'text-blue-500',
    },
    {
      label: '오늘 활성 사용자',
      value: `${(adminStats?.activeUsersToday ?? 0).toLocaleString()}명`,
      sub: `전체 ${(adminStats?.totalUsers ?? 0).toLocaleString()}명`,
      icon: Users,
      color: 'text-violet-500',
    },
    {
      label: 'TOP 사용자 매출',
      value: adminStats?.topUsers?.[0]
        ? `₩${adminStats.topUsers[0].totalAmount.toLocaleString()}`
        : '-',
      sub: adminStats?.topUsers?.[0]
        ? `${adminStats.topUsers[0].orderCount}건 주문`
        : '데이터 없음',
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{card.label}</CardDescription>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-muted-foreground text-xs">{card.sub}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
