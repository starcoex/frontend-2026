import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReservations } from '@starcoex-frontend/reservations';
import { WalkInTable } from './components/walk-in-table';
import { WalkInStats } from './components/walk-in-stats';

export default function WalkInsPage() {
  const { walkIns, isLoading, error, fetchWalkIns } = useReservations();

  useEffect(() => {
    fetchWalkIns({});
  }, [fetchWalkIns]);

  if (isLoading) {
    return <LoadingSpinner message="워크인 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`워크인 관리 - ${COMPANY_INFO.name}`}
        description="워크인 대기 목록을 조회하고 관리하세요."
        keywords={['워크인', '대기 관리', COMPANY_INFO.name]}
        og={{
          title: `워크인 관리 - ${COMPANY_INFO.name}`,
          description: '워크인 대기 목록 관리 시스템',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        <WalkInStats walkIns={walkIns} />

        {error && <ErrorAlert error={error} onRetry={() => fetchWalkIns({})} />}

        {!error && (
          <WalkInTable data={walkIns} onRefresh={() => fetchWalkIns({})} />
        )}
      </div>
    </>
  );
}
