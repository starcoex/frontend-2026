import { ShoppingCart, CircleDollarSign, Clock, TruckIcon } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@starcoex-frontend/orders';

export function OrderStats({ orders }: { orders: Order[] }) {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === 'PENDING').length;
  const delivering = orders.filter((o) => o.status === 'SHIPPED').length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + o.finalAmount, 0);

  const stats = [
    {
      label: '전체 주문',
      value: total,
      icon: ShoppingCart,
      badge: null,
    },
    {
      label: '결제 완료 매출',
      value: `₩${totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '대기 중',
      value: pending,
      icon: Clock,
      badge:
        pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : null,
    },
    {
      label: '배송 중',
      value: delivering,
      icon: TruckIcon,
      badge: null,
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
