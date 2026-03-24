import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReservations } from '@starcoex-frontend/reservations';
import { ReservationTable } from './components/reservation-table';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';

export default function ReservationsPage() {
  const { reservations, isLoading, error, fetchReservations } =
    useReservations();

  if (isLoading) {
    return <LoadingSpinner message="예약 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`예약 관리 - ${COMPANY_INFO.name}`}
        description="예약 목록을 조회하고 관리하세요."
        keywords={['예약 관리', '예약 목록', COMPANY_INFO.name]}
        og={{
          title: `예약 관리 - ${COMPANY_INFO.name}`,
          description: '예약 목록 조회 및 관리 시스템',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert error={error} onRetry={() => fetchReservations({})} />
      )}

      {!error && <ReservationTable data={reservations} />}
    </>
  );
}
