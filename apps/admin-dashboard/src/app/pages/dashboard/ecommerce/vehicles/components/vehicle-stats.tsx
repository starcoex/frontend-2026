import { Car, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Vehicle } from '@starcoex-frontend/vehicles';

export function VehicleStats({ vehicles }: { vehicles: Vehicle[] }) {
  const total = vehicles.length;
  const active = vehicles.filter((v) => v.status === 'ACTIVE').length;
  const pending = vehicles.filter(
    (v) => v.status === 'PENDING_VERIFICATION'
  ).length;
  const manualReview = vehicles.filter(
    (v) => v.status === 'MANUAL_REVIEW'
  ).length;

  const stats = [
    { label: '전체 차량', value: total, icon: Car, badge: null },
    { label: '정상', value: active, icon: CheckCircle2, badge: null },
    {
      label: '등급 결정 대기',
      value: pending,
      icon: Clock,
      badge:
        pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : null,
    },
    {
      label: '관리자 검토',
      value: manualReview,
      icon: AlertTriangle,
      badge:
        manualReview > 0
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
