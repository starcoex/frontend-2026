import { TrendingUp, Star, Truck } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';

export function DriverStatsCard({ driver }: { driver: DeliveryDriver }) {
  const stats = [
    {
      label: '총 배송 건수',
      value: `${driver.totalDeliveries}건`,
      icon: Truck,
    },
    {
      label: '완료율',
      value:
        driver.completionRate != null
          ? `${Number(driver.completionRate).toFixed(1)}%`
          : '-',
      icon: TrendingUp,
    },
    {
      label: '평균 평점',
      value: driver.avgRating
        ? `⭐ ${Number(driver.avgRating).toFixed(1)}`
        : '-',
      icon: Star,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
