import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useInventory } from '@starcoex-frontend/inventory';
import { LowStockTable } from './components/low-stock-table';
import { LowStockStats } from './components/low-stock-stats';

export default function LowStockPage() {
  const { lowStockInventories, isLoading, error, fetchLowStockInventories } =
    useInventory();

  useEffect(() => {
    // layout에서 이미 호출하지만, 직접 접근 시 데이터 없으면 재호출
    if (lowStockInventories.length === 0) {
      fetchLowStockInventories();
    }
  }, [fetchLowStockInventories, lowStockInventories.length]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            재고 부족 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`재고 부족 현황 - ${COMPANY_INFO.name}`}
        description="재고 부족 및 재주문이 필요한 항목을 확인하세요."
        keywords={['재고 부족', '재주문', '재고 알림', COMPANY_INFO.name]}
        og={{
          title: `재고 부족 현황 - ${COMPANY_INFO.name}`,
          description: '재고 부족 및 재주문 필요 항목 모니터링',
          image: '/images/og-inventory.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>데이터 로딩 실패</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLowStockInventories()}
                className="ml-4"
              >
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!error && (
          <>
            <LowStockStats inventories={lowStockInventories} />
            <LowStockTable data={lowStockInventories} />
          </>
        )}
      </div>
    </>
  );
}
