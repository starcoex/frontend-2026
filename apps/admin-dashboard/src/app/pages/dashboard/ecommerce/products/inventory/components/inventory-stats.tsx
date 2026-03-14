import { AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InventoryRow } from './inventory-columns';

interface InventoryStatsProps {
  inventories: InventoryRow[];
}

export function InventoryStats({ inventories }: InventoryStatsProps) {
  const total = inventories.length;
  const available = inventories.filter((i) => i.isAvailable).length;
  const lowStock = inventories.filter((i) => i.stock <= i.minStock).length;
  const totalStock = inventories.reduce((sum, i) => sum + i.stock, 0);

  const stats = [
    {
      label: '전체 재고 항목',
      value: total,
      icon: Package,
      badge: null,
    },
    {
      label: '총 재고 수량',
      value: totalStock.toLocaleString(),
      icon: Package,
      badge: null,
    },
    {
      label: '판매 가능',
      value: available,
      icon: CheckCircle2,
      badge: {
        label: `${total ? Math.round((available / total) * 100) : 0}%`,
        variant: 'success' as const,
      },
    },
    {
      label: '재고 부족',
      value: lowStock,
      icon: AlertTriangle,
      badge:
        lowStock > 0
          ? { label: '주의', variant: 'destructive' as const }
          : null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
