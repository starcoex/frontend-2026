import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReviewSummaryStats } from '@starcoex-frontend/reviews';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: ReviewSummaryStats | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '건수', key: 'value' },
];

export function OverviewReviewStats({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const items = [
    { label: '전체 리뷰', value: data?.total ?? 0 },
    { label: '활성 리뷰', value: data?.active ?? 0 },
    { label: '신고 리뷰', value: data?.reported ?? 0 },
    { label: '숨김 리뷰', value: data?.hidden ?? 0 },
  ];

  const exportData = items.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              리뷰 현황
            </CardTitle>
            <CardDescription>리뷰 관리 현황</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <ExportButton
              data={exportData}
              columns={EXPORT_COLUMNS}
              fileName="reviews"
              pdfTitle="리뷰 현황"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => navigate('/admin/reviews')}
            >
              전체보기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="hover:bg-muted/50 cursor-pointer rounded-md border p-3 transition-colors"
              onClick={() => navigate('/admin/reviews')}
            >
              <p className="text-muted-foreground text-xs">{item.label}</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-6 w-16" />
              ) : (
                <p className="mt-0.5 text-lg font-bold">
                  {item.value.toLocaleString()}건
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
