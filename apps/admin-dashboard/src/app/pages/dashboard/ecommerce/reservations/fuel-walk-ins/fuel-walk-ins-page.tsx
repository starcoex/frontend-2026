import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useFuelWalkIns } from '@starcoex-frontend/reservations';
import { FuelWalkInTable } from './components/fuel-walk-in-table';
import { FuelWalkInStats } from './components/fuel-walk-in-stats';

export default function FuelWalkInsPage() {
  const { fuelWalkIns, isLoading, error, fetchFuelWalkIns } = useFuelWalkIns();

  useEffect(() => {
    fetchFuelWalkIns({});
  }, [fetchFuelWalkIns]);

  if (isLoading) {
    return <LoadingSpinner message="주유 워크인 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`주유 워크인 - ${COMPANY_INFO.name}`}
        description="주유 워크인 목록을 조회하고 관리하세요."
        keywords={['주유 워크인', '주유 관리', COMPANY_INFO.name]}
        og={{
          title: `주유 워크인 - ${COMPANY_INFO.name}`,
          description: '주유 워크인 관리 시스템',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        <FuelWalkInStats fuelWalkIns={fuelWalkIns} />

        {error && (
          <ErrorAlert error={error} onRetry={() => fetchFuelWalkIns({})} />
        )}

        {!error && (
          <FuelWalkInTable
            data={fuelWalkIns}
            onRefresh={() => fetchFuelWalkIns({})}
          />
        )}
      </div>
    </>
  );
}
