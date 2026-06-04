import { useEffect } from 'react';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { PersonalStatsCard } from '@/app/pages/dashboard/board/analytics/components/personal-stats-card';
import { SavingsGoalProgressCard } from '@/app/pages/dashboard/board/analytics/components/savings-goal-progress-card';
import { UserServiceStatsCard } from '@/app/pages/dashboard/board/analytics/components/user-service-stats-card';
import { UserActivityFeed } from '@/app/pages/dashboard/board/analytics/components/user-activity-feed';
import { UserAchievementList } from '@/app/pages/dashboard/board/analytics/components/user-achievement-list';

export default function OverviewPage() {
  const {
    isLoading,
    error,
    personalStats,
    savingsGoalProgress,
    userServiceStats,
    userAchievements,
    userRecentActivities,
    fetchPersonalStats,
    fetchSavingsGoalProgress,
    fetchUserServiceStats,
    fetchUserAchievements,
    fetchUserRecentActivities,
    clearError,
  } = useAnalytics();

  useEffect(() => {
    fetchPersonalStats();
    fetchSavingsGoalProgress();
    fetchUserServiceStats();
    fetchUserAchievements();
    fetchUserRecentActivities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && !personalStats) {
    return <LoadingSpinner message="분석 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            clearError();
            fetchPersonalStats();
          }}
        />
      )}

      {/* 개인 통계 카드 */}
      <PersonalStatsCard data={personalStats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 절약 목표 진행률 */}
        <div className="lg:col-span-1">
          <SavingsGoalProgressCard
            data={savingsGoalProgress}
            isLoading={isLoading}
          />
        </div>

        {/* 서비스별 통계 */}
        <div className="lg:col-span-2">
          <UserServiceStatsCard data={userServiceStats} isLoading={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 최근 활동 */}
        <UserActivityFeed data={userRecentActivities} isLoading={isLoading} />

        {/* 업적 */}
        <UserAchievementList data={userAchievements} isLoading={isLoading} />
      </div>
    </div>
  );
}
