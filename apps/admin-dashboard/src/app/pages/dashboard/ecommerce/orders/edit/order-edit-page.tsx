import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '@starcoex-frontend/orders';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditOrderForm from './edit-order-form';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, isLoading, error, fetchOrderById } = useOrders();

  useEffect(() => {
    if (id) fetchOrderById(parseInt(id));
  }, [id, fetchOrderById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            주문 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '주문을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/orders')}>
          주문 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`주문 ${currentOrder.orderNumber} 수정 - ${COMPANY_INFO.name}`}
        description="주문 정보를 수정하세요."
        keywords={['주문 수정', currentOrder.orderNumber, COMPANY_INFO.name]}
        og={{
          title: `주문 ${currentOrder.orderNumber} 수정 - ${COMPANY_INFO.name}`,
          description: '주문 정보를 수정하세요.',
          image: '/images/og-orders.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <EditOrderForm order={currentOrder} />
      </div>
    </>
  );
}
