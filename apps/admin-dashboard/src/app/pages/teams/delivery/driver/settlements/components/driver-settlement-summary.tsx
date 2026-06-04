import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DriverSettlement } from '@starcoex-frontend/delivery';
import {
  IconWallet,
  IconTrendingUp,
  IconTruck,
  IconClock,
} from '@tabler/icons-react';

interface DriverSettlementSummaryProps {
  settlements: DriverSettlement[];
}

export function DriverSettlementSummary({
  settlements,
}: DriverSettlementSummaryProps) {
  if (settlements.length === 0) return null;

  const summary = {
    totalGrossAmount: settlements.reduce(
      (acc, s) => acc + Number(s.grossAmount),
      0
    ),
    totalNetAmount: settlements.reduce(
      (acc, s) => acc + Number(s.netAmount),
      0
    ),
    totalDeliveries: settlements.reduce((acc, s) => acc + s.totalDeliveries, 0),
    totalCount: settlements.length,
  };

  const items = [
    {
      icon: <IconWallet className="h-4 w-4" />,
      label: '총 수입',
      value: `₩${summary.totalGrossAmount.toLocaleString()}`,
      className: 'text-blue-600',
    },
    {
      icon: <IconTrendingUp className="h-4 w-4" />,
      label: '실수령액',
      value: `₩${summary.totalNetAmount.toLocaleString()}`,
      className: 'text-green-600',
    },
    {
      icon: <IconTruck className="h-4 w-4" />,
      label: '총 배송',
      value: `${summary.totalDeliveries}건`,
      className: 'text-orange-600',
    },
    {
      icon: <IconClock className="h-4 w-4" />,
      label: '정산 건수',
      value: `${summary.totalCount}건`,
      className: 'text-purple-600',
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ icon, label, value, className }) => (
        <Card key={label}>
          <CardContent className="p-3">
            <div className={cn('mb-1 flex items-center gap-1.5', className)}>
              {icon}
              <span className="text-muted-foreground text-xs">{label}</span>
            </div>
            <p className="text-sm font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
