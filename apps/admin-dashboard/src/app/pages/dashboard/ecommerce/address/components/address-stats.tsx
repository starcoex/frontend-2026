import { useMemo } from 'react';
import { MapPin, Building2, CheckCircle2, Clock } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Address, AddressStatsResult } from '@starcoex-frontend/address';

interface AddressStatsProps {
  addresses: Address[];
  statsData: AddressStatsResult | null;
}

export function AddressStats({ addresses, statsData }: AddressStatsProps) {
  const stats = useMemo(() => {
    const active = addresses.filter((a) => a.status === 'ACTIVE').length;
    const apartments = addresses.filter(
      (a) => a.buildingType === 'APARTMENT'
    ).length;
    return { active, apartments };
  }, [addresses]);

  const statItems = [
    {
      label: '전체 주소 수',
      value: statsData?.totalAddresses ?? addresses.length,
      icon: MapPin,
      badge: null,
    },
    {
      label: '활성 주소',
      value: statsData?.activeAddresses ?? stats.active,
      icon: CheckCircle2,
      badge:
        stats.active > 0
          ? { label: '정상', variant: 'success' as const }
          : null,
    },
    {
      label: '자주 사용',
      value: statsData?.frequentAddresses ?? 0,
      icon: Building2,
      badge:
        (statsData?.frequentAddresses ?? 0) > 0
          ? { label: '5회 이상', variant: 'default' as const }
          : { label: '없음', variant: 'outline' as const },
    },
    {
      label: '총 검색 횟수',
      value: statsData?.totalSearches ?? 0,
      icon: Clock,
      badge: null,
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
