import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { PromotionSummaryStats } from '@starcoex-frontend/promotions';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: PromotionSummaryStats | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'displayValue' },
];

export function OverviewPromotionStats({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const total = data?.statusCounts?.reduce((acc, s) => acc + s.count, 0) ?? 0;
  const active =
    data?.statusCounts?.find((s) => s.status === 'ACTIVE')?.count ?? 0;

  const items = [
    { label: '전체 프로모션', displayValue: total, numValue: total },
    { label: '활성 프로모션', displayValue: active, numValue: active },
    {
      label: '30일 총 사용',
      displayValue: data?.last30Days?.totalUsage ?? 0,
      numValue: data?.last30Days?.totalUsage ?? 0,
    },
    {
      label: '30일 총 할인액',
      displayValue: `₩${(
        data?.last30Days?.totalDiscount ?? 0
      ).toLocaleString()}`,
      numValue: null,
    },
    {
      label: '30일 순 매출',
      displayValue: `₩${(
        data?.last30Days?.totalRevenue ?? 0
      ).toLocaleString()}`,
      numValue: null,
    },
    {
      label: '30일 이용 사용자',
      displayValue: data?.last30Days?.uniqueUsers ?? 0,
      numValue: data?.last30Days?.uniqueUsers ?? 0,
    },
  ];

  const exportData = items.map((item) => ({
    label: item.label,
    displayValue: String(item.displayValue),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-orange-500" />
              프로모션 현황
            </CardTitle>
            <CardDescription>현재 프로모션 운영 현황</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <ExportButton
              data={exportData}
              columns={EXPORT_COLUMNS}
              fileName="promotions"
              pdfTitle="프로모션 현황"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => navigate('/admin/promotions')}
            >
              전체보기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="hover:bg-muted/50 cursor-pointer rounded-md border p-2 transition-colors"
              onClick={() => navigate('/admin/promotions')}
            >
              <p className="text-muted-foreground text-xs">{item.label}</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-5 w-14" />
              ) : (
                <p className="mt-0.5 font-bold">
                  {typeof item.displayValue === 'number'
                    ? item.displayValue.toLocaleString()
                    : item.displayValue}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
