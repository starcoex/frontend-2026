import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SettlementSummaryOutput } from '@starcoex-frontend/delivery';

interface AdminSettlementSummaryProps {
  summary: SettlementSummaryOutput;
}

export function AdminSettlementSummary({
  summary,
}: AdminSettlementSummaryProps) {
  const items = [
    {
      label: '전체',
      value: `${summary.totalCount}건`,
      className: 'text-gray-600',
    },
    {
      label: '총 지급액',
      value: `₩${summary.totalNetAmount.toLocaleString()}`,
      className: 'text-blue-600',
    },
    {
      label: '정산 대기',
      value: `${summary.pendingCount}건`,
      className: 'text-yellow-600',
    },
    {
      label: '계산 완료',
      value: `${summary.calculatedCount}건`,
      className: 'text-orange-600',
    },
    {
      label: '승인 완료',
      value: `${summary.approvedCount}건`,
      className: 'text-purple-600',
    },
    {
      label: '지급 완료',
      value: `${summary.paidCount}건`,
      className: 'text-green-600',
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map(({ label, value, className }) => (
        <Card key={label}>
          <CardContent className="p-3">
            <p className={cn('mb-0.5 text-xs', className)}>{label}</p>
            <p className="text-sm font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
