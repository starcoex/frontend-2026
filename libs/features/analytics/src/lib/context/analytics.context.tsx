import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type {
  AnalyticsState,
  AnalyticsContextValue,
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
  SavingsGoalProgressOutput,
  UserDashboardSummaryStats,
  VisitorStatsDetailed,
} from '../types';
import { serviceRegistry, initAnalyticsService } from '../services';

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(
  undefined
);

const initialState: AnalyticsState = {
  personalStats: null,
  serviceBreakdown: [],
  userDashboardStats: null,
  userActivities: [],
  adminDashboardStats: null,
  analyticsSummaryStats: null,
  globalLeaderboard: [],
  userRanking: null,
  realtimeStats: null,
  realtimeSummaryStats: null,
  userDashboardData: null,
  userOverview: null,
  userServiceStats: [],
  userRecentActivities: [],
  userAchievements: [],
  savingsGoalProgress: null,
  dashboardSummaryStats: null,
  visitorStats: null,
  isLoading: false,
  error: null,
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AnalyticsState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('analytics')) {
      try {
        initAnalyticsService(apolloClient);
      } catch (error) {
        console.error('❌ AnalyticsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  const setPersonalStats = useCallback(
    (personalStats: PersonalStatsOutput | null) =>
      setState((prev) => ({ ...prev, personalStats })),
    []
  );

  const setServiceBreakdown = useCallback(
    (serviceBreakdown: ServiceBreakdownOutput[]) =>
      setState((prev) => ({ ...prev, serviceBreakdown })),
    []
  );

  const setUserDashboardStats = useCallback(
    (userDashboardStats: UserDashboardStatsOutput | null) =>
      setState((prev) => ({ ...prev, userDashboardStats })),
    []
  );

  const setUserActivities = useCallback(
    (userActivities: UserActivityOutput[]) =>
      setState((prev) => ({ ...prev, userActivities })),
    []
  );

  const setAdminDashboardStats = useCallback(
    (adminDashboardStats: AdminDashboardStatsOutput | null) =>
      setState((prev) => ({ ...prev, adminDashboardStats })),
    []
  );

  const setAnalyticsSummaryStats = useCallback(
    (analyticsSummaryStats: AnalyticsSummaryStats | null) =>
      setState((prev) => ({ ...prev, analyticsSummaryStats })),
    []
  );

  const setGlobalLeaderboard = useCallback(
    (globalLeaderboard: LeaderboardEntryOutput[]) =>
      setState((prev) => ({ ...prev, globalLeaderboard })),
    []
  );

  const setUserRanking = useCallback(
    (userRanking: UserRankingOutput | null) =>
      setState((prev) => ({ ...prev, userRanking })),
    []
  );

  const setRealtimeStats = useCallback(
    (realtimeStats: RealtimeStatsOutput | null) =>
      setState((prev) => ({ ...prev, realtimeStats })),
    []
  );

  const setRealtimeSummaryStats = useCallback(
    (realtimeSummaryStats: RealtimeSummaryStats | null) =>
      setState((prev) => ({ ...prev, realtimeSummaryStats })),
    []
  );

  const setUserDashboardData = useCallback(
    (userDashboardData: UserDashboardData | null) =>
      setState((prev) => ({ ...prev, userDashboardData })),
    []
  );

  const setUserOverview = useCallback(
    (userOverview: UserDashboardOverview | null) =>
      setState((prev) => ({ ...prev, userOverview })),
    []
  );

  const setUserServiceStats = useCallback(
    (userServiceStats: UserServiceStats[]) =>
      setState((prev) => ({ ...prev, userServiceStats })),
    []
  );

  const setUserRecentActivities = useCallback(
    (userRecentActivities: UserActivityItem[]) =>
      setState((prev) => ({ ...prev, userRecentActivities })),
    []
  );

  const setUserAchievements = useCallback(
    (userAchievements: UserAchievementItem[]) =>
      setState((prev) => ({ ...prev, userAchievements })),
    []
  );

  const setSavingsGoalProgress = useCallback(
    (savingsGoalProgress: SavingsGoalProgressOutput | null) =>
      setState((prev) => ({ ...prev, savingsGoalProgress })),
    []
  );

  const setDashboardSummaryStats = useCallback(
    (dashboardSummaryStats: UserDashboardSummaryStats | null) =>
      setState((prev) => ({ ...prev, dashboardSummaryStats })),
    []
  );

  const setVisitorStats = useCallback(
    (visitorStats: VisitorStatsDetailed | null) =>
      setState((prev) => ({ ...prev, visitorStats })),
    []
  );

  const setLoading = useCallback(
    (isLoading: boolean) => setState((prev) => ({ ...prev, isLoading })),
    []
  );

  const setError = useCallback(
    (error: string | null) =>
      setState((prev) => ({ ...prev, error, isLoading: false })),
    []
  );

  const clearError = useCallback(
    () => setState((prev) => ({ ...prev, error: null })),
    []
  );

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      ...state,
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
      reset,
    }),
    [
      state,
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
      reset,
    ]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = (): AnalyticsContextValue => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error(
      'useAnalyticsContext must be used within an AnalyticsProvider'
    );
  }
  return ctx;
};
