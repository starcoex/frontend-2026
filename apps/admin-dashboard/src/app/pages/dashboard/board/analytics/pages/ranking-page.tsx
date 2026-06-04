import { useEffect } from 'react';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { UserRankingCard } from '@/app/pages/dashboard/board/analytics/components/user-ranking-card';
import { RealtimeSummaryStatsCard } from '@/app/pages/dashboard/board/analytics/components/realtime-summary-stats-card';
import { GlobalLeaderboardTable } from '@/app/pages/dashboard/board/analytics/components/global-leaderboard-table';

export default function RankingPage() {
  const {
    isLoading,
    error,
    userRanking,
    globalLeaderboard,
    realtimeSummaryStats,
    fetchUserRanking,
    fetchGlobalLeaderboard,
    fetchRealtimeSummaryStats,
    clearError,
  } = useAnalytics();

  useEffect(() => {
    fetchUserRanking();
    fetchGlobalLeaderboard();
    fetchRealtimeSummaryStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && !userRanking) {
    return <LoadingSpinner message="랭킹 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            clearError();
            fetchUserRanking();
            fetchGlobalLeaderboard();
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 내 랭킹 */}
        <div className="lg:col-span-1">
          <UserRankingCard data={userRanking} isLoading={isLoading} />
        </div>

        {/* 실시간 요약 통계 */}
        <div className="lg:col-span-2">
          <RealtimeSummaryStatsCard
            data={realtimeSummaryStats}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 글로벌 리더보드 */}
      <GlobalLeaderboardTable data={globalLeaderboard} isLoading={isLoading} />
    </div>
  );
}
