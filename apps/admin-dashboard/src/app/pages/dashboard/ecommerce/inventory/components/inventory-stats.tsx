import { useMemo } from 'react';
import { Package, AlertTriangle, RotateCcw, Warehouse } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StoreInventory } from '@starcoex-frontend/inventory';

export function InventoryStats({
  inventories,
}: {
  inventories: StoreInventory[];
}) {
  const stats = useMemo(() => {
    const totalItems = inventories.length;
    const lowStockCount = inventories.filter((inv) => inv.isLowStock).length;
    const outOfStockCount = inventories.filter(
      (inv) => inv.isOutOfStock
    ).length;
    const needsReorderCount = inventories.filter(
      (inv) => inv.needsReorder
    ).length;
    const totalAvailableStock = inventories.reduce(
      (sum, inv) => sum + inv.availableStock,
      0
    );
    // 신규: 알림 카운트
    const hasAlertCount = inventories.filter(
      (inv) => inv.hasMinStockAlert || inv.hasReorderAlert
    ).length;
    const hasExpiringCount = inventories.filter(
      (inv) => inv.hasExpiringItems
    ).length;

    return {
      totalItems,
      lowStockCount,
      outOfStockCount,
      needsReorderCount,
      totalAvailableStock,
      hasAlertCount,
      hasExpiringCount,
    };
  }, [inventories]);

  const statItems = [
    {
      label: '전체 재고 항목',
      value: stats.totalItems.toLocaleString(),
      icon: Warehouse,
      badge: null,
    },
    {
      label: '총 가용 재고',
      value: stats.totalAvailableStock.toLocaleString(),
      icon: Package,
      badge: null,
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
    {
      label: '재주문 필요',
      value: stats.needsReorderCount,
      icon: RotateCcw,
      badge:
        stats.needsReorderCount > 0
          ? { label: '조치 필요', variant: 'warning' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '유통기한 임박',
      value: stats.hasExpiringCount,
      icon: AlertTriangle,
      badge:
        stats.hasExpiringCount > 0
          ? { label: '확인 필요', variant: 'destructive' as const }
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
