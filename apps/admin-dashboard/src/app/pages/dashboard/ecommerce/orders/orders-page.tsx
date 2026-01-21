import OrdersDataTable from './data-table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

async function getOrders() {
  const response = await fetch('/orders.json');
  if (!response.ok) {
    throw new Error('주문 데이터를 불러오지 못했습니다.');
  }
  return await response.json();
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            주문 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">에러: {error}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`주문 관리 - ${COMPANY_INFO.name}`}
        description="주문 목록을 조회하고 관리하세요. 주문 상태를 추적하고 효율적으로 처리할 수 있습니다."
        keywords={[
          '주문 관리',
          '주문 목록',
          '주문 추적',
          '배송 관리',
          COMPANY_INFO.name,
        ]}
        og={{
          title: `주문 관리 - ${COMPANY_INFO.name}`,
          description: '주문 목록 조회 및 관리 시스템',
          image: '/images/og-orders.jpg',
          type: 'website',
        }}
      />
      <OrdersDataTable data={orders} />
    </>
  );
}
