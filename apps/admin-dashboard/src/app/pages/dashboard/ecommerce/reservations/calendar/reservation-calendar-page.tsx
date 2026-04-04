import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { ReservationCalendar } from './components/reservation-calendar';

export default function ReservationCalendarPage() {
  return (
    <>
      <PageHead
        title={`예약 캘린더 - ${COMPANY_INFO.name}`}
        description="예약 일정을 캘린더 형식으로 조회하고 관리하세요."
        keywords={['예약 캘린더', '예약 관리', COMPANY_INFO.name]}
        og={{
          title: `예약 캘린더 - ${COMPANY_INFO.name}`,
          description: '예약 일정 캘린더',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />
      <ReservationCalendar />
    </>
  );
}
