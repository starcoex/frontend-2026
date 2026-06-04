import { useEffect, useState } from 'react';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import type { MonthlyActivityStatsOutput } from '@starcoex-frontend/analytics';
import { MonthlyActivityStatsCard } from '@/app/pages/dashboard/board/analytics/components/monthly-activity-stats-card';
import { ServiceBreakdownChart } from '@/app/pages/dashboard/board/analytics/components/service-breakdown-chart';
import { ServiceBreakdownTable } from '@/app/pages/dashboard/board/analytics/components/service-breakdown-table';

export default function ServiceAnalyticsPage() {
  const {
    isLoading,
    error,
    serviceBreakdown,
    fetchServiceBreakdown,
    fetchMonthlyActivityStats,
    clearError,
  } = useAnalytics();

  const now = new Date();
  const [monthlyStats, setMonthlyStats] =
    useState<MonthlyActivityStatsOutput | null>(null);

  useEffect(() => {
    fetchServiceBreakdown();
    fetchMonthlyActivityStats(now.getFullYear(), now.getMonth() + 1).then(
      (res) => {
        if (res.success && res.data) setMonthlyStats(res.data);
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && serviceBreakdown.length === 0) {
    return <LoadingSpinner message="서비스 분석 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            clearError();
            fetchServiceBreakdown();
          }}
        />
      )}

      {/* 월별 활동 통계 */}
      <MonthlyActivityStatsCard data={monthlyStats} isLoading={isLoading} />

      {/* 서비스 분석 차트 */}
      <ServiceBreakdownChart data={serviceBreakdown} isLoading={isLoading} />

      {/* 서비스 분석 테이블 */}
      <ServiceBreakdownTable data={serviceBreakdown} isLoading={isLoading} />
    </div>
  );
}
