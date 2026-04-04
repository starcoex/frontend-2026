import { useEffect } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useNotifications } from '@starcoex-frontend/notifications';
import { NotificationTable } from '@/app/pages/dashboard/ecommerce/notifications/components/notification-table';

export default function NotificationsPage() {
  const { notifications, isLoading, error, fetchAdminAllNotifications } =
    useNotifications();

  useEffect(() => {
    // 페이지 진입마다 최신 전체 알림 목록 조회
    fetchAdminAllNotifications({ limit: 50, offset: 0 });
  }, [fetchAdminAllNotifications]);

  if (isLoading) {
    return <LoadingSpinner message="알림 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`알림 관리 - ${COMPANY_INFO.name}`}
        description="전체 유저의 알림 목록을 관리합니다."
        keywords={['알림 관리', '알림 목록', COMPANY_INFO.name]}
        og={{
          title: `알림 관리 - ${COMPANY_INFO.name}`,
          description: '전체 알림 목록 조회 및 관리 시스템',
          image: '/images/og-components.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => fetchAdminAllNotifications({ limit: 50, offset: 0 })}
        />
      )}

      {!error && <NotificationTable data={notifications} />}
    </>
  );
}
