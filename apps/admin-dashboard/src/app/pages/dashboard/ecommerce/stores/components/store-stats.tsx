import { useMemo } from 'react';
import { Store, TrendingUp, ShoppingCart, Star } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type {
  Store as StoreType,
  StoreStatsOutput,
} from '@starcoex-frontend/stores';

interface StoreStatsProps {
  stores: StoreType[];
  statistics: StoreStatsOutput | null;
}

export function StoreStats({ stores, statistics }: StoreStatsProps) {
  const computed = useMemo(() => {
    const totalOrders = stores.reduce((sum, s) => sum + s.orderCount, 0);
    const storesWithRating = stores.filter((s) => s.rating !== null);
    const averageRating =
      storesWithRating.length > 0
        ? (
            storesWithRating.reduce(
              (sum, s) => sum + Number(s.rating ?? 0),
              0
            ) / storesWithRating.length
          ).toFixed(1)
        : '0.0';
    return { totalOrders, averageRating, storesWithRating };
  }, [stores]);

  const { current, growthRate } = statistics ?? {
    current: {
      totalStores: stores.length,
      activeStores: stores.filter((s) => s.isActive).length,
    },
    growthRate: { totalStores: 0, activeStores: 0 },
  };

  const statItems = [
    {
      label: '전체 매장',
      value: current.totalStores,
      icon: Store,
      badge: {
        label: `${
          growthRate.totalStores >= 0 ? '+' : ''
        }${growthRate.totalStores.toFixed(1)}%`,
        className:
          growthRate.totalStores >= 0 ? 'text-green-600' : 'text-red-600',
      },
    },
    {
      label: '활성 매장',
      value: current.activeStores,
      icon: TrendingUp,
      badge: {
        label: `${
          growthRate.activeStores >= 0 ? '+' : ''
        }${growthRate.activeStores.toFixed(1)}%`,
        className:
          growthRate.activeStores >= 0 ? 'text-green-600' : 'text-red-600',
      },
    },
    {
      label: '총 주문수',
      value: computed.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      badge: {
        label:
          stores.length > 0
            ? `평균 ${Math.round(computed.totalOrders / stores.length)}개`
            : '0개',
        className: 'text-muted-foreground',
      },
    },
    {
      label: '평균 평점',
      value: computed.averageRating,
      icon: Star,
      badge: {
        label:
          computed.storesWithRating.length > 0
            ? `${computed.storesWithRating.length}개 매장`
            : '평점 없음',
        className: 'text-muted-foreground',
      },
    },
  ];

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
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <span className={stat.badge.className}>{stat.badge.label}</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
