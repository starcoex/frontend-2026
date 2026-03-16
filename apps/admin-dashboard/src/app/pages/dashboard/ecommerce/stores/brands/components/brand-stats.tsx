import { useMemo } from 'react';
import { Tag, TrendingUp, ShoppingCart, Star } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Brand, Store } from '@starcoex-frontend/stores';

interface BrandStatsProps {
  brands: Brand[];
  stores: Store[];
}

export function BrandStats({ brands, stores }: BrandStatsProps) {
  const computed = useMemo(() => {
    const activeBrands = brands.filter((b) => b.isActive).length;
    const activeBrandsPercent =
      brands.length > 0
        ? ((activeBrands / brands.length) * 100).toFixed(1)
        : '0.0';
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
    return {
      activeBrands,
      activeBrandsPercent,
      totalOrders,
      averageRating,
      storesWithRating,
    };
  }, [brands, stores]);

  const statItems = [
    {
      label: '전체 브랜드',
      value: brands.length,
      icon: Tag,
      badge: {
        label: `${brands.length}개`,
        className: 'text-muted-foreground',
      },
    },
    {
      label: '활성 브랜드',
      value: computed.activeBrands,
      icon: TrendingUp,
      badge: {
        label: `${computed.activeBrandsPercent}%`,
        className: 'text-green-600',
      },
    },
    {
      label: '총 주문수',
      value: computed.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      badge: {
        label:
          stores.length > 0
            ? `매장당 평균 ${Math.round(
                computed.totalOrders / stores.length
              )}개`
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
            ? `${computed.storesWithRating.length}개 매장 기준`
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
