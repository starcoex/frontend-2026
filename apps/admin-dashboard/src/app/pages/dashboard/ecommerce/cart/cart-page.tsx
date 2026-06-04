import { useCallback, useEffect, useState } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useCart } from '@starcoex-frontend/cart';
import { CartTable } from './components/cart-table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BulkDeleteDialog } from '@starcoex-frontend/common';

export default function CartPage() {
  const {
    carts,
    cartsTotal,
    isLoading,
    error,
    fetchAdminCarts,
    adminCleanupCarts,
  } = useCart();

  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  useEffect(() => {
    fetchAdminCarts();
  }, [fetchAdminCarts]);

  // 정리 후 목록 새로고침
  const handleCleanupSuccess = useCallback(() => {
    fetchAdminCarts();
  }, [fetchAdminCarts]);

  const handleCleanup = async () => {
    setIsCleaning(true);
    const res = await adminCleanupCarts();
    setIsCleaning(false);
    if (res.success) {
      toast.success(`만료/빈 장바구니 ${res.data}개를 정리했습니다.`);
      handleCleanupSuccess();
    } else {
      toast.error(res.error?.message ?? '장바구니 정리에 실패했습니다.');
    }
    setCleanupDialogOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="장바구니 목록을 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`장바구니 관리 - ${COMPANY_INFO.name}`}
        description="장바구니 목록을 관리하고 필터링하세요."
        keywords={['장바구니 관리', '장바구니 목록', COMPANY_INFO.name]}
        og={{
          title: `장바구니 관리 - ${COMPANY_INFO.name}`,
          description: '장바구니 목록 조회 및 관리 시스템',
          image: '/images/og-cart.jpg',
          type: 'website',
        }}
      />

      {error && <ErrorAlert error={error} onRetry={() => fetchAdminCarts()} />}

      {!error && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCleanupDialogOpen(true)}
              className="text-destructive hover:text-destructive"
              disabled={isLoading}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              만료/빈 장바구니 정리
            </Button>
          </div>

          <CartTable
            data={carts}
            total={cartsTotal}
            onPageChange={(offset) => fetchAdminCarts({ offset })}
          />
        </div>
      )}

      <BulkDeleteDialog
        open={cleanupDialogOpen}
        onOpenChange={(open) => !isCleaning && setCleanupDialogOpen(open)}
        onConfirm={handleCleanup}
        isDeleting={isCleaning}
        count={0}
        itemLabel="만료/빈 장바구니"
        description="만료되었거나 비어있는 장바구니를 모두 정리합니다. 이 작업은 되돌릴 수 없습니다."
      />
    </>
  );
}
