import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useInventory } from '@starcoex-frontend/inventory';
import { InventoryTable } from './components/inventory-table';
import { useEffect } from 'react';

export default function InventoryPage() {
  const { inventories, isLoading, error, fetchStoreInventories } =
    useInventory();

  useEffect(() => {
    fetchStoreInventories();
  }, [fetchStoreInventories]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            재고 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`재고 관리 - ${COMPANY_INFO.name}`}
        description="매장별 재고 현황을 관리하고 모니터링하세요."
        keywords={['재고 관리', '재고 현황', '매장 재고', COMPANY_INFO.name]}
        og={{
          title: `재고 관리 - ${COMPANY_INFO.name}`,
          description: '매장별 재고 현황 및 관리 시스템',
          image: '/images/og-emails.jpg',
          type: 'website',
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStoreInventories()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && <InventoryTable data={inventories} />}
    </>
  );
}
