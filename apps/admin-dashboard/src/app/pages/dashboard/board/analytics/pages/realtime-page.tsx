import { useEffect } from 'react';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { TodayActivityCard } from '@/app/pages/dashboard/board/analytics/components/today-activity-card';
import { RealtimeStatsCard } from '@/app/pages/dashboard/board/analytics/components/realtaime-stats-card';
import { SystemStatusCard } from '@/app/pages/dashboard/board/analytics/components/system-stats-card';
import { RealtimeAlertList } from '@/app/pages/dashboard/board/analytics/components/realtaime-alert-list';

export default function RealtimePage() {
  const { isLoading, error, realtimeStats, fetchRealtimeStats, clearError } =
    useAnalytics();

  useEffect(() => {
    fetchRealtimeStats();

    // 30초마다 자동 갱신
    const interval = setInterval(() => {
      fetchRealtimeStats();
    }, 30_000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && !realtimeStats) {
    return <LoadingSpinner message="실시간 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            clearError();
            fetchRealtimeStats();
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 오늘 활동 */}
        <TodayActivityCard
          data={realtimeStats?.todayActivity ?? null}
          isLoading={isLoading}
        />

        {/* 실시간 통계 요약 */}
        <div className="md:col-span-2">
          <RealtimeStatsCard data={realtimeStats} isLoading={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 시스템 상태 */}
        <SystemStatusCard
          data={realtimeStats?.systemStatus ?? null}
          isLoading={isLoading}
        />

        {/* 최근 실시간 알림 */}
        <div className="lg:col-span-2">
          <RealtimeAlertList
            data={realtimeStats?.recentAlerts ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
