import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useOrders } from '@starcoex-frontend/orders';
import { OrderTable } from './components/order-table';

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            주문 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`주문 관리 - ${COMPANY_INFO.name}`}
        description="주문 목록을 관리하고 상태를 변경하세요."
        keywords={['주문 관리', '주문 목록', COMPANY_INFO.name]}
        og={{
          title: `주문 관리 - ${COMPANY_INFO.name}`,
          description: '주문 목록 조회 및 상태 관리 시스템',
          image: '/images/og-orders.jpg',
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
              onClick={() => fetchOrders()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && <OrderTable data={orders} />}
    </>
  );
}
