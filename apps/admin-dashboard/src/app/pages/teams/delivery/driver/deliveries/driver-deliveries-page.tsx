import { useCallback, useEffect, useState } from 'react';
import {
  LoadingSpinner,
  ErrorAlert,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { Delivery } from '@starcoex-frontend/delivery';
import { DriverDeliveryTable } from './components/driver-delivery-table';

export default function DriverDeliveriesPage() {
  const { isLoading, error, fetchMyDeliveries } = useDelivery();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    fetchMyDeliveries().then((res) => {
      if (res?.success && res.data) {
        setDeliveries(res.data.deliveries);
      }
    });
  }, [fetchMyDeliveries]);

  const handleUpdated = useCallback((updated: Delivery) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  }, []);

  if (isLoading)
    return <LoadingSpinner message="배송 데이터를 불러오는 중..." />;

  return (
    <>
      <PageHead
        title={`내 배송 목록 - ${COMPANY_INFO.name}`}
        description="배정된 배송 목록을 확인하고 상태를 업데이트하세요."
        keywords={['배송 목록', '배달기사', COMPANY_INFO.name]}
        og={{
          title: `내 배송 목록 - ${COMPANY_INFO.name}`,
          description: '배달기사 배송 관리 시스템',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert error={error} onRetry={() => fetchMyDeliveries()} />
      )}

      {!error && (
        <DriverDeliveryTable data={deliveries} onUpdated={handleUpdated} />
      )}
    </>
  );
}
