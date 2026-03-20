import { useMemo } from 'react';
import { AlertTriangle, PackageX, RotateCcw, ShieldAlert } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StoreInventory } from '@starcoex-frontend/inventory';

interface LowStockStatsProps {
  inventories: StoreInventory[];
}

export function LowStockStats({ inventories }: LowStockStatsProps) {
  const stats = useMemo(() => {
    const outOfStock = inventories.filter((inv) => inv.isOutOfStock).length;
    const lowStock = inventories.filter(
      (inv) => inv.isLowStock && !inv.isOutOfStock
    ).length;
    const needsReorder = inventories.filter(
      (inv) => inv.needsReorder && !inv.isLowStock
    ).length;
    const total = inventories.length;

    return { outOfStock, lowStock, needsReorder, total };
  }, [inventories]);

  const statItems = [
    {
      label: '전체 조치 필요',
      value: stats.total,
      icon: ShieldAlert,
      badge:
        stats.total > 0
          ? { label: '확인 필요', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '재고 없음',
      value: stats.outOfStock,
      icon: PackageX,
      badge:
        stats.outOfStock > 0
          ? { label: '즉시 입고', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '재고 부족',
      value: stats.lowStock,
      icon: AlertTriangle,
      badge:
        stats.lowStock > 0
          ? { label: '조치 필요', variant: 'warning' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '재주문 필요',
      value: stats.needsReorder,
      icon: RotateCcw,
      badge:
        stats.needsReorder > 0
          ? { label: '발주 필요', variant: 'warning' as const }
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
