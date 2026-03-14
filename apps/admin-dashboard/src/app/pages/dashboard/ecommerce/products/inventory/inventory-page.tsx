import { useEffect, useMemo } from 'react';
import { AlertCircle, Loader2, PackageX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useProducts } from '@starcoex-frontend/products';
import { InventoryStats } from './components/inventory-stats';
import { InventoryTable } from './components/inventory-table';
import type { InventoryRow } from './components/inventory-columns';

export default function InventoryPage() {
  const { products, isLoading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // products → InventoryRow 평면화
  const inventoryRows = useMemo<InventoryRow[]>(() => {
    return products.flatMap((product) =>
      product.inventories.map((inv) => ({
        ...inv,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          imageUrls: product.imageUrls,
        },
      }))
    );
  }, [products]);

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
        description="매장별 상품 재고 현황을 관리하세요."
        keywords={['재고 관리', '재고 현황', '매장 재고', COMPANY_INFO.name]}
        og={{
          title: `재고 관리 - ${COMPANY_INFO.name}`,
          description: '매장별 상품 재고 현황 관리',
          image: '/images/og-inventory.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-6">
        {/* 에러 알림 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>데이터 로딩 실패</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProducts()}
                className="ml-4"
              >
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* 통계 카드 */}
        {!error && <InventoryStats inventories={inventoryRows} />}

        {/* Empty State */}
        {!error && inventoryRows.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed">
            <PackageX className="text-muted-foreground h-12 w-12" />
            <h3 className="text-lg font-semibold">재고 항목이 없습니다</h3>
            <p className="text-muted-foreground text-sm">
              제품에 매장 재고를 등록하여 관리를 시작하세요
            </p>
          </div>
        )}

        {/* 재고 테이블 */}
        {!error && inventoryRows.length > 0 && (
          <InventoryTable data={inventoryRows} />
        )}
      </div>
    </>
  );
}
