import { useCallback, useRef } from 'react';
import { useAnalyticsContext } from '../context';
import { getAnalyticsService } from '../services';
import type {
  ApiResponse,
  PersonalStatsOutput,
  ServiceBreakdownOutput,
  UserDashboardStatsOutput,
  UserActivityOutput,
  AdminDashboardStatsOutput,
  AnalyticsSummaryStats,
  LeaderboardEntryOutput,
  UserRankingOutput,
  RealtimeStatsOutput,
  RealtimeSummaryStats,
  UserDashboardData,
  UserDashboardOverview,
  UserServiceStats,
  UserActivityItem,
  UserAchievementItem,
  MonthlyActivityStatsOutput,
  SavingsGoalProgressOutput,
  UserDashboardSummaryStats,
  VisitorStatsDetailed,
  CleanupResultOutput,
  UserDashboardQueryInput,
} from '../types';

export const useAnalytics = () => {
  const context = useAnalyticsContext();

  const {
    setPersonalStats,
    setServiceBreakdown,
    setUserDashboardStats,
    setUserActivities,
    setAdminDashboardStats,
    setAnalyticsSummaryStats,
    setGlobalLeaderboard,
    setUserRanking,
    setRealtimeStats,
    setRealtimeSummaryStats,
    setUserDashboardData,
    setUserOverview,
    setUserServiceStats,
    setUserRecentActivities,
    setUserAchievements,
    setSavingsGoalProgress,
    setDashboardSummaryStats,
    setVisitorStats,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // ============================================================================
  // 공통 로딩 래퍼
  // ============================================================================

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ============================================================================
  // Queries
  // ============================================================================

  const fetchPersonalStats = useCallback(
    async (): Promise<ApiResponse<PersonalStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getPersonalStats();
        if (res.success && res.data) setPersonalStats(res.data);
        return res;
      }, '개인 통계를 불러오는데 실패했습니다.'),
    [withLoading, setPersonalStats]
  );

  const fetchServiceBreakdown = useCallback(
    async (
      services?: string[]
    ): Promise<ApiResponse<ServiceBreakdownOutput[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getServiceBreakdown(services);
        if (res.success && res.data) setServiceBreakdown(res.data);
        return res;
      }, '서비스 분석 데이터를 불러오는데 실패했습니다.'),
    [withLoading, setServiceBreakdown]
  );

  const fetchUserDashboard = useCallback(
    async (): Promise<ApiResponse<UserDashboardStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserDashboard();
        if (res.success && res.data) setUserDashboardStats(res.data);
        return res;
      }, '사용자 대시보드를 불러오는데 실패했습니다.'),
    [withLoading, setUserDashboardStats]
  );

  const fetchUserActivities = useCallback(
    async (limit?: number): Promise<ApiResponse<UserActivityOutput[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserActivities(limit);
        if (res.success && res.data) setUserActivities(res.data);
        return res;
      }, '사용자 활동 내역을 불러오는데 실패했습니다.'),
    [withLoading, setUserActivities]
  );

  const fetchAdminDashboard = useCallback(
    async (): Promise<ApiResponse<AdminDashboardStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAdminDashboard();
        if (res.success && res.data) setAdminDashboardStats(res.data);
        return res;
      }, '어드민 대시보드를 불러오는데 실패했습니다.'),
    [withLoading, setAdminDashboardStats]
  );

  const fetchAnalyticsSummaryStats = useCallback(
    async (): Promise<ApiResponse<AnalyticsSummaryStats>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAnalyticsSummaryStats();
        if (res.success && res.data) setAnalyticsSummaryStats(res.data);
        return res;
      }, '분석 요약 통계를 불러오는데 실패했습니다.'),
    [withLoading, setAnalyticsSummaryStats]
  );

  const fetchAdminUserDashboard = useCallback(
    async (
      targetUserId: number
    ): Promise<ApiResponse<UserDashboardStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAdminUserDashboard(targetUserId);
        if (res.success && res.data) setUserDashboardStats(res.data);
        return res;
      }, '대상 사용자 대시보드를 불러오는데 실패했습니다.'),
    [withLoading, setUserDashboardStats]
  );

  const fetchAdminUserActivities = useCallback(
    async (
      targetUserId: number,
      limit?: number
    ): Promise<ApiResponse<UserActivityOutput[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAdminUserActivities(targetUserId, limit);
        if (res.success && res.data) setUserActivities(res.data);
        return res;
      }, '대상 사용자 활동 내역을 불러오는데 실패했습니다.'),
    [withLoading, setUserActivities]
  );

  const fetchGlobalLeaderboard = useCallback(
    async (
      limit?: number,
      category?: string
    ): Promise<ApiResponse<LeaderboardEntryOutput[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getGlobalLeaderboard(limit, category);
        if (res.success && res.data) setGlobalLeaderboard(res.data);
        return res;
      }, '글로벌 리더보드를 불러오는데 실패했습니다.'),
    [withLoading, setGlobalLeaderboard]
  );

  const fetchUserRanking = useCallback(
    async (): Promise<ApiResponse<UserRankingOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserRanking();
        if (res.success && res.data) setUserRanking(res.data);
        return res;
      }, '사용자 랭킹을 불러오는데 실패했습니다.'),
    [withLoading, setUserRanking]
  );

  const fetchRealtimeStats = useCallback(
    async (): Promise<ApiResponse<RealtimeStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getRealtimeStats();
        if (res.success && res.data) setRealtimeStats(res.data);
        return res;
      }, '실시간 통계를 불러오는데 실패했습니다.'),
    [withLoading, setRealtimeStats]
  );

  const fetchAdminUserRealtimeStats = useCallback(
    async (targetUserId: number): Promise<ApiResponse<RealtimeStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAdminUserRealtimeStats(targetUserId);
        if (res.success && res.data) setRealtimeStats(res.data);
        return res;
      }, '대상 사용자 실시간 통계를 불러오는데 실패했습니다.'),
    [withLoading, setRealtimeStats]
  );

  const fetchRealtimeSummaryStats = useCallback(
    async (): Promise<ApiResponse<RealtimeSummaryStats>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getRealtimeSummaryStats();
        if (res.success && res.data) setRealtimeSummaryStats(res.data);
        return res;
      }, '실시간 요약 통계를 불러오는데 실패했습니다.'),
    [withLoading, setRealtimeSummaryStats]
  );

  const fetchUserDashboardData = useCallback(
    async (
      query?: UserDashboardQueryInput
    ): Promise<ApiResponse<UserDashboardData>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserDashboardData(query);
        if (res.success && res.data) setUserDashboardData(res.data);
        return res;
      }, '사용자 대시보드 데이터를 불러오는데 실패했습니다.'),
    [withLoading, setUserDashboardData]
  );

  const fetchUserOverview = useCallback(
    async (): Promise<ApiResponse<UserDashboardOverview>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserOverview();
        if (res.success && res.data) setUserOverview(res.data);
        return res;
      }, '사용자 개요를 불러오는데 실패했습니다.'),
    [withLoading, setUserOverview]
  );

  const fetchUserServiceStats = useCallback(
    async (serviceFilter?: string): Promise<ApiResponse<UserServiceStats[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserServiceStats(serviceFilter);
        if (res.success && res.data) setUserServiceStats(res.data);
        return res;
      }, '사용자 서비스 통계를 불러오는데 실패했습니다.'),
    [withLoading, setUserServiceStats]
  );

  const fetchUserRecentActivities = useCallback(
    async (limit?: number): Promise<ApiResponse<UserActivityItem[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserRecentActivities(limit);
        if (res.success && res.data) setUserRecentActivities(res.data);
        return res;
      }, '최근 활동 내역을 불러오는데 실패했습니다.'),
    [withLoading, setUserRecentActivities]
  );

  const fetchUserAchievements = useCallback(
    async (): Promise<ApiResponse<UserAchievementItem[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getUserAchievements();
        if (res.success && res.data) setUserAchievements(res.data);
        return res;
      }, '사용자 업적을 불러오는데 실패했습니다.'),
    [withLoading, setUserAchievements]
  );

  const fetchMonthlyActivityStats = useCallback(
    async (
      year: number,
      month: number
    ): Promise<ApiResponse<MonthlyActivityStatsOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getMonthlyActivityStats(year, month);
        return res;
      }, '월별 활동 통계를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchSavingsGoalProgress = useCallback(
    async (): Promise<ApiResponse<SavingsGoalProgressOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getSavingsGoalProgress();
        if (res.success && res.data) setSavingsGoalProgress(res.data);
        return res;
      }, '절약 목표 진행률을 불러오는데 실패했습니다.'),
    [withLoading, setSavingsGoalProgress]
  );

  const fetchAdminUserDashboardData = useCallback(
    async (targetUserId: number): Promise<ApiResponse<UserDashboardData>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAdminUserDashboardData(targetUserId);
        if (res.success && res.data) setUserDashboardData(res.data);
        return res;
      }, '대상 사용자 대시보드 데이터를 불러오는데 실패했습니다.'),
    [withLoading, setUserDashboardData]
  );

  const fetchAdminUserActivitiesV2 = useCallback(
    async (
      targetUserId: number,
      limit?: number
    ): Promise<ApiResponse<UserActivityItem[]>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getAdminUserActivitiesV2(targetUserId, limit);
        if (res.success && res.data) setUserRecentActivities(res.data);
        return res;
      }, '대상 사용자 활동 내역을 불러오는데 실패했습니다.'),
    [withLoading, setUserRecentActivities]
  );

  const fetchDashboardSummaryStats = useCallback(
    async (): Promise<ApiResponse<UserDashboardSummaryStats>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getDashboardSummaryStats();
        if (res.success && res.data) setDashboardSummaryStats(res.data);
        return res;
      }, '대시보드 요약 통계를 불러오는데 실패했습니다.'),
    [withLoading, setDashboardSummaryStats]
  );

  const fetchVisitorStats = useCallback(
    async (days?: number): Promise<ApiResponse<VisitorStatsDetailed>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.getVisitorStats(days);
        if (res.success && res.data) setVisitorStats(res.data);
        return res;
      }, '방문자 통계를 불러오는데 실패했습니다.'),
    [withLoading, setVisitorStats]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const updateSavingsGoal = useCallback(
    async (savingsGoal: string): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.setSavingsGoal(savingsGoal);
        if (res.success) {
          const progressRes = await service.getSavingsGoalProgress();
          if (progressRes.success && progressRes.data)
            setSavingsGoalProgress(progressRes.data);
        }
        return res;
      }, '절약 목표 설정에 실패했습니다.'),
    [withLoading, setSavingsGoalProgress]
  );

  const updateMonthlyTarget = useCallback(
    async (monthlyTarget: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        return service.setMonthlyTarget(monthlyTarget);
      }, '월간 목표 설정에 실패했습니다.'),
    [withLoading]
  );

  const runCleanupVisitorData = useCallback(
    async (days?: number): Promise<ApiResponse<CleanupResultOutput>> =>
      withLoading(async () => {
        const service = getAnalyticsService();
        const res = await service.cleanupVisitorData(days);
        if (res.success) {
          const statsRes = await service.getVisitorStats();
          if (statsRes.success && statsRes.data) setVisitorStats(statsRes.data);
        }
        return res;
      }, '방문자 데이터 정리에 실패했습니다.'),
    [withLoading, setVisitorStats]
  );

  // ============================================================================
  // 편의 계산값
  // ============================================================================

  const totalSavings = context.personalStats?.totalSavings ?? 0;
  const totalAmount = context.personalStats?.totalAmount ?? 0;
  const totalEvents = context.personalStats?.totalEvents ?? 0;
  const currentRank = context.realtimeStats?.liveRanking.currentRank ?? null;
  const savingsProgress = context.savingsGoalProgress?.progressPercentage ?? 0;

  return {
    ...context,

    // Queries
    fetchPersonalStats,
    fetchServiceBreakdown,
    fetchUserDashboard,
    fetchUserActivities,
    fetchAdminDashboard,
    fetchAnalyticsSummaryStats,
    fetchAdminUserDashboard,
    fetchAdminUserActivities,
    fetchGlobalLeaderboard,
    fetchUserRanking,
    fetchRealtimeStats,
    fetchAdminUserRealtimeStats,
    fetchRealtimeSummaryStats,
    fetchUserDashboardData,
    fetchUserOverview,
    fetchUserServiceStats,
    fetchUserRecentActivities,
    fetchUserAchievements,
    fetchMonthlyActivityStats,
    fetchSavingsGoalProgress,
    fetchAdminUserDashboardData,
    fetchAdminUserActivitiesV2,
    fetchDashboardSummaryStats,
    fetchVisitorStats,

    // Mutations
    updateSavingsGoal,
    updateMonthlyTarget,
    runCleanupVisitorData,

    // 편의 값
    totalSavings,
    totalAmount,
    totalEvents,
    currentRank,
    savingsProgress,
  };
};
