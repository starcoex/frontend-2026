import { useCallback, useEffect } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import { DeliveryTable } from './components/delivery-table';

export default function DeliveryPage() {
  const { deliveries, isLoading, error, fetchDeliveries, removeDelivery } =
    useDelivery();

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  // ✅ 단건 삭제 후 로컬 상태에서 제거
  const handleDeleted = useCallback(
    (deliveryId: number) => {
      removeDelivery(deliveryId);
    },
    [removeDelivery]
  );

  // ✅ 다건 삭제 후 목록 새로고침
  const handleDeleteSuccess = useCallback(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  if (isLoading) {
    return <LoadingSpinner message="배송 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`배송 관리 - ${COMPANY_INFO.name}`}
        description="배송 현황을 관리하고 모니터링하세요."
        keywords={['배송 관리', '배송 현황', '배달기사', COMPANY_INFO.name]}
        og={{
          title: `배송 관리 - ${COMPANY_INFO.name}`,
          description: '배송 현황 및 관리 시스템',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      {error && <ErrorAlert error={error} onRetry={() => fetchDeliveries()} />}

      {!error && (
        <DeliveryTable
          data={deliveries}
          onDeleted={handleDeleted}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
