import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useHeatingOilDeliveries } from '@starcoex-frontend/reservations';
import { HeatingOilDeliveryTable } from './components/heating-oil-delivery-table';
import { HeatingOilDeliveryStats } from './components/heating-oil-delivery-stats';

export default function HeatingOilDeliveriesPage() {
  const { deliveries, isLoading, error, fetchDeliveries } =
    useHeatingOilDeliveries();

  useEffect(() => {
    fetchDeliveries({});
  }, [fetchDeliveries]);

  if (isLoading) {
    return <LoadingSpinner message="난방유 배달 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`난방유 배달 - ${COMPANY_INFO.name}`}
        description="난방유 배달 목록을 조회하고 관리하세요."
        keywords={['난방유 배달', '배달 관리', COMPANY_INFO.name]}
        og={{
          title: `난방유 배달 - ${COMPANY_INFO.name}`,
          description: '난방유 배달 관리 시스템',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        <HeatingOilDeliveryStats deliveries={deliveries} />

        {error && (
          <ErrorAlert error={error} onRetry={() => fetchDeliveries({})} />
        )}

        {!error && (
          <HeatingOilDeliveryTable
            data={deliveries}
            onRefresh={() => fetchDeliveries({})}
          />
        )}
      </div>
    </>
  );
}
