import { Truck, TrendingUp, Power, Star, Wallet, Users } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';

interface DriverStatsProps {
  drivers: DeliveryDriver[];
}

export function DriverStats({ drivers }: DriverStatsProps) {
  const total = drivers.length;
  const active = drivers.filter((d) => d.status === 'ACTIVE').length;
  const available = drivers.filter((d) => d.isAvailable).length;
  const pending = drivers.filter((d) => d.status === 'PENDING').length;
  const avgRating =
    total > 0
      ? (
          drivers.reduce((sum, d) => sum + (d.avgRating ?? 0), 0) / total
        ).toFixed(1)
      : '-';
  const avgRate =
    total > 0
      ? Math.round(
          drivers.reduce((sum, d) => sum + (d.ratePerDelivery ?? 0), 0) / total
        ).toLocaleString()
      : '-';

  const stats = [
    { label: '전체 기사', value: total, icon: Users },
    { label: '활성 기사', value: active, icon: TrendingUp },
    { label: '현재 가용', value: available, icon: Power },
    { label: '승인 대기', value: pending, icon: Truck },
    { label: '평균 평점', value: avgRating, icon: Star },
    {
      label: '평균 건당 수수료',
      value: avgRate === '-' ? '-' : `₩${avgRate}`,
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <s.icon className="size-4 opacity-60" />
              {s.label}
            </CardDescription>
            <CardTitle className="text-2xl">{s.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
