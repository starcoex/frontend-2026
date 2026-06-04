import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { usePromotions } from '@starcoex-frontend/promotions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PromotionsTable } from './components/promotions-table';
import { PromotionsStats } from './components/promotions-stats';
import type { PromotionStatus } from '@starcoex-frontend/promotions';

const STATUS_OPTIONS: { value: PromotionStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'DRAFT', label: '초안' },
  { value: 'PENDING_APPROVAL', label: '승인 대기' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'PAUSED', label: '일시 정지' },
  { value: 'ENDED', label: '종료됨' },
  { value: 'CANCELLED', label: '취소됨' },
];

const PAGE_SIZE = 20;

export default function PromotionsPage() {
  const navigate = useNavigate();
  const {
    promotions,
    summaryStats,
    pagination,
    isLoading,
    error,
    fetchPromotions,
    fetchPromotionSummaryStats,
    clearError,
  } = usePromotions();

  const [statusFilter, setStatusFilter] = useState<PromotionStatus | 'ALL'>(
    'ALL'
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPromotionSummaryStats();
  }, [fetchPromotionSummaryStats]);

  useEffect(() => {
    fetchPromotions({
      status: statusFilter === 'ALL' ? undefined : [statusFilter],
      page,
      limit: PAGE_SIZE,
    });
  }, [statusFilter, page, fetchPromotions]);

  const handleStatusChange = (value: string) => {
    setPage(1);
    setStatusFilter(value as PromotionStatus | 'ALL');
  };

  if (isLoading && promotions.length === 0) {
    return <LoadingSpinner message="프로모션 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`프로모션 관리 - ${COMPANY_INFO.name}`}
        description="프로모션 캠페인을 생성하고 관리하세요."
        keywords={['프로모션', '할인', '쿠폰', '캠페인', COMPANY_INFO.name]}
        og={{
          title: `프로모션 관리 - ${COMPANY_INFO.name}`,
          description: '프로모션 캠페인 조회 및 관리',
          type: 'website',
        }}
      />

      <div className="mb-6">
        <PromotionsStats stats={summaryStats} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pagination.total > 0 && (
            <span className="text-muted-foreground text-sm">
              총 {pagination.total.toLocaleString()}개
            </span>
          )}
        </div>

        <Button onClick={() => navigate('/admin/promotions/create')}>
          <Plus className="mr-2 h-4 w-4" />
          프로모션 생성
        </Button>
      </div>

      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            clearError();
            fetchPromotions({
              status: statusFilter === 'ALL' ? undefined : [statusFilter],
              page,
              limit: PAGE_SIZE,
            });
          }}
        />
      )}

      {!error && (
        <>
          <PromotionsTable data={promotions} />

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </Button>
              <span className="text-muted-foreground text-sm">
                {page} / {pagination.totalPages} 페이지
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
