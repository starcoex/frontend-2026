import { Search, CheckCircle2, XCircle, CircleDollarSign } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ApickStatsSummary } from '@starcoex-frontend/vehicles';

export function ApickStats({ stats }: { stats: ApickStatsSummary | null }) {
  const statItems = [
    { label: '전체 조회', value: stats?.totalChecks ?? 0, icon: Search },
    { label: '성공', value: stats?.successChecks ?? 0, icon: CheckCircle2 },
    { label: '실패', value: stats?.failedChecks ?? 0, icon: XCircle },
    {
      label: '총 비용',
      value: `${(stats?.totalCost ?? 0).toLocaleString()}원`,
      icon: CircleDollarSign,
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
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
