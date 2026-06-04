import { useEffect } from 'react';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { AnalyticsSummaryStatsCard } from '@/app/pages/dashboard/board/analytics/components/analytics-summary-stats-card';
import { AdminDashboardStatsCard } from '@/app/pages/dashboard/board/analytics/components/admin-dashboard-stats-card';
import { DashboardSummaryStatsCard } from '@/app/pages/dashboard/board/analytics/components/dashboard-summary-stats-card';
import { VisitorStatsCard } from '@/app/pages/dashboard/board/analytics/components/visitor-stats-card';

export default function AdminAnalyticsPage() {
  const {
    isLoading,
    error,
    adminDashboardStats,
    analyticsSummaryStats,
    dashboardSummaryStats,
    visitorStats,
    fetchAdminDashboard,
    fetchAnalyticsSummaryStats,
    fetchDashboardSummaryStats,
    fetchVisitorStats,
    clearError,
  } = useAnalytics();

  useEffect(() => {
    fetchAdminDashboard();
    fetchAnalyticsSummaryStats();
    fetchDashboardSummaryStats();
    fetchVisitorStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && !adminDashboardStats) {
    return <LoadingSpinner message="어드민 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            clearError();
            fetchAdminDashboard();
          }}
        />
      )}

      {/* 분석 요약 통계 */}
      <AnalyticsSummaryStatsCard
        data={analyticsSummaryStats}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 어드민 대시보드 통계 */}
        <AdminDashboardStatsCard
          data={adminDashboardStats}
          isLoading={isLoading}
        />

        {/* 대시보드 요약 */}
        <DashboardSummaryStatsCard
          data={dashboardSummaryStats}
          isLoading={isLoading}
        />
      </div>

      {/* 방문자 통계 */}
      <VisitorStatsCard data={visitorStats} isLoading={isLoading} />
    </div>
  );
}
