import { useMemo } from 'react';
import {
  Package,
  CircleDollarSign,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@starcoex-frontend/products';

export function ProductStats({ products }: { products: Product[] }) {
  const stats = useMemo(() => {
    const totalRevenue = products.reduce(
      (sum, p) => sum + p.basePrice * p.orderCount,
      0
    );
    const totalOrders = products.reduce((sum, p) => sum + p.orderCount, 0);
    const featuredCount = products.filter((p) => p.isFeatured).length;
    const lowStockCount = products.filter((p) => {
      const totalStock = p.inventories.reduce((sum, inv) => sum + inv.stock, 0);
      return totalStock < 10;
    }).length;

    return { totalRevenue, totalOrders, featuredCount, lowStockCount };
  }, [products]);

  const statItems = [
    {
      label: '총 매출',
      value: `₩${stats.totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '총 주문수',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      badge: null,
    },
    {
      label: '추천 상품',
      value: stats.featuredCount,
      icon: Package,
      badge:
        products.length > 0
          ? {
              label: `${Math.round(
                (stats.featuredCount / products.length) * 100
              )}%`,
              variant: 'outline' as const,
            }
          : null,
    },
    {
      label: '재고 부족',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      badge:
        stats.lowStockCount > 0
          ? { label: '주의', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
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
            {stat.badge && (
              <CardAction>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
