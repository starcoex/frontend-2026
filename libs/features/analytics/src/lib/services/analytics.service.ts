import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_PERSONAL_STATS,
  GET_SERVICE_BREAKDOWN,
  GET_USER_DASHBOARD,
  GET_USER_ACTIVITIES,
  GET_ADMIN_DASHBOARD,
  GET_ANALYTICS_SUMMARY_STATS,
  GET_ADMIN_USER_DASHBOARD,
  GET_ADMIN_USER_ACTIVITIES,
  GET_GLOBAL_LEADERBOARD,
  GET_USER_RANKING,
  GET_REALTIME_STATS,
  GET_ADMIN_USER_REALTIME_STATS,
  GET_REALTIME_SUMMARY_STATS,
  GET_USER_DASHBOARD_DATA,
  GET_USER_OVERVIEW,
  GET_USER_SERVICE_STATS,
  GET_USER_RECENT_ACTIVITIES,
  GET_USER_ACHIEVEMENTS,
  GET_MONTHLY_ACTIVITY_STATS,
  GET_SAVINGS_GOAL_PROGRESS,
  GET_ADMIN_USER_DASHBOARD_DATA,
  GET_ADMIN_USER_ACTIVITIES_V2,
  GET_DASHBOARD_SUMMARY_STATS,
  GET_VISITOR_STATS,
  SET_SAVINGS_GOAL,
  SET_MONTHLY_TARGET,
  CLEANUP_VISITOR_DATA,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  IAnalyticsService,
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

export class AnalyticsService implements IAnalyticsService {
  constructor(private client: ApolloClient) {}

  // ============================================================================
  // 공통 헬퍼
  // ============================================================================

  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          extensions: extensions ?? {},
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(
    mutation: any,
    variables: TVars = {} as TVars
  ): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ============================================================================
  // Queries
  // ============================================================================

  async getPersonalStats(): Promise<ApiResponse<PersonalStatsOutput>> {
    const res = await this.query<{ getPersonalStats: PersonalStatsOutput }>(
      GET_PERSONAL_STATS
    );
    if (res.success && res.data?.getPersonalStats) {
      return { success: true, data: res.data.getPersonalStats };
    }
    return res as unknown as ApiResponse<PersonalStatsOutput>;
  }

  async getServiceBreakdown(
    services?: string[]
  ): Promise<ApiResponse<ServiceBreakdownOutput[]>> {
    const res = await this.query<{
      getServiceBreakdown: ServiceBreakdownOutput[];
    }>(GET_SERVICE_BREAKDOWN, { services });
    if (res.success && res.data?.getServiceBreakdown) {
      return { success: true, data: res.data.getServiceBreakdown };
    }
    return res as unknown as ApiResponse<ServiceBreakdownOutput[]>;
  }

  async getUserDashboard(): Promise<ApiResponse<UserDashboardStatsOutput>> {
    const res = await this.query<{ userDashboard: UserDashboardStatsOutput }>(
      GET_USER_DASHBOARD
    );
    if (res.success && res.data?.userDashboard) {
      return { success: true, data: res.data.userDashboard };
    }
    return res as unknown as ApiResponse<UserDashboardStatsOutput>;
  }

  async getUserActivities(
    limit?: number
  ): Promise<ApiResponse<UserActivityOutput[]>> {
    const res = await this.query<{ userActivities: UserActivityOutput[] }>(
      GET_USER_ACTIVITIES,
      { limit }
    );
    if (res.success && res.data?.userActivities) {
      return { success: true, data: res.data.userActivities };
    }
    return res as unknown as ApiResponse<UserActivityOutput[]>;
  }

  async getAdminDashboard(): Promise<ApiResponse<AdminDashboardStatsOutput>> {
    const res = await this.query<{ adminDashboard: AdminDashboardStatsOutput }>(
      GET_ADMIN_DASHBOARD
    );
    if (res.success && res.data?.adminDashboard) {
      return { success: true, data: res.data.adminDashboard };
    }
    return res as unknown as ApiResponse<AdminDashboardStatsOutput>;
  }

  async getAnalyticsSummaryStats(): Promise<
    ApiResponse<AnalyticsSummaryStats>
  > {
    const res = await this.query<{
      analyticsSummaryStats: AnalyticsSummaryStats;
    }>(GET_ANALYTICS_SUMMARY_STATS);
    if (res.success && res.data?.analyticsSummaryStats) {
      return { success: true, data: res.data.analyticsSummaryStats };
    }
    return res as unknown as ApiResponse<AnalyticsSummaryStats>;
  }

  async getAdminUserDashboard(
    targetUserId: number
  ): Promise<ApiResponse<UserDashboardStatsOutput>> {
    const res = await this.query<{
      adminUserDashboard: UserDashboardStatsOutput;
    }>(GET_ADMIN_USER_DASHBOARD, { targetUserId });
    if (res.success && res.data?.adminUserDashboard) {
      return { success: true, data: res.data.adminUserDashboard };
    }
    return res as unknown as ApiResponse<UserDashboardStatsOutput>;
  }

  async getAdminUserActivities(
    targetUserId: number,
    limit?: number
  ): Promise<ApiResponse<UserActivityOutput[]>> {
    const res = await this.query<{ adminUserActivities: UserActivityOutput[] }>(
      GET_ADMIN_USER_ACTIVITIES,
      { targetUserId, limit }
    );
    if (res.success && res.data?.adminUserActivities) {
      return { success: true, data: res.data.adminUserActivities };
    }
    return res as unknown as ApiResponse<UserActivityOutput[]>;
  }

  async getGlobalLeaderboard(
    limit?: number,
    category?: string
  ): Promise<ApiResponse<LeaderboardEntryOutput[]>> {
    const res = await this.query<{
      getGlobalLeaderboard: LeaderboardEntryOutput[];
    }>(GET_GLOBAL_LEADERBOARD, { limit, category });
    if (res.success && res.data?.getGlobalLeaderboard) {
      return { success: true, data: res.data.getGlobalLeaderboard };
    }
    return res as unknown as ApiResponse<LeaderboardEntryOutput[]>;
  }

  async getUserRanking(): Promise<ApiResponse<UserRankingOutput>> {
    const res = await this.query<{ getUserRanking: UserRankingOutput }>(
      GET_USER_RANKING
    );
    if (res.success && res.data?.getUserRanking) {
      return { success: true, data: res.data.getUserRanking };
    }
    return res as unknown as ApiResponse<UserRankingOutput>;
  }

  async getRealtimeStats(): Promise<ApiResponse<RealtimeStatsOutput>> {
    const res = await this.query<{ getRealtimeStats: RealtimeStatsOutput }>(
      GET_REALTIME_STATS
    );
    if (res.success && res.data?.getRealtimeStats) {
      return { success: true, data: res.data.getRealtimeStats };
    }
    return res as unknown as ApiResponse<RealtimeStatsOutput>;
  }

  async getAdminUserRealtimeStats(
    targetUserId: number
  ): Promise<ApiResponse<RealtimeStatsOutput>> {
    const res = await this.query<{
      getAdminUserRealtimeStats: RealtimeStatsOutput;
    }>(GET_ADMIN_USER_REALTIME_STATS, { targetUserId });
    if (res.success && res.data?.getAdminUserRealtimeStats) {
      return { success: true, data: res.data.getAdminUserRealtimeStats };
    }
    return res as unknown as ApiResponse<RealtimeStatsOutput>;
  }

  async getRealtimeSummaryStats(): Promise<ApiResponse<RealtimeSummaryStats>> {
    const res = await this.query<{
      getRealtimeSummaryStats: RealtimeSummaryStats;
    }>(GET_REALTIME_SUMMARY_STATS);
    if (res.success && res.data?.getRealtimeSummaryStats) {
      return { success: true, data: res.data.getRealtimeSummaryStats };
    }
    return res as unknown as ApiResponse<RealtimeSummaryStats>;
  }

  async getUserDashboardData(
    query?: UserDashboardQueryInput
  ): Promise<ApiResponse<UserDashboardData>> {
    const res = await this.query<{ getUserDashboard: UserDashboardData }>(
      GET_USER_DASHBOARD_DATA,
      { query }
    );
    if (res.success && res.data?.getUserDashboard) {
      return { success: true, data: res.data.getUserDashboard };
    }
    return res as unknown as ApiResponse<UserDashboardData>;
  }

  async getUserOverview(): Promise<ApiResponse<UserDashboardOverview>> {
    const res = await this.query<{ getUserOverview: UserDashboardOverview }>(
      GET_USER_OVERVIEW
    );
    if (res.success && res.data?.getUserOverview) {
      return { success: true, data: res.data.getUserOverview };
    }
    return res as unknown as ApiResponse<UserDashboardOverview>;
  }

  async getUserServiceStats(
    serviceFilter?: string
  ): Promise<ApiResponse<UserServiceStats[]>> {
    const res = await this.query<{ getUserServiceStats: UserServiceStats[] }>(
      GET_USER_SERVICE_STATS,
      { serviceFilter }
    );
    if (res.success && res.data?.getUserServiceStats) {
      return { success: true, data: res.data.getUserServiceStats };
    }
    return res as unknown as ApiResponse<UserServiceStats[]>;
  }

  async getUserRecentActivities(
    limit?: number
  ): Promise<ApiResponse<UserActivityItem[]>> {
    const res = await this.query<{
      getUserRecentActivities: UserActivityItem[];
    }>(GET_USER_RECENT_ACTIVITIES, { limit });
    if (res.success && res.data?.getUserRecentActivities) {
      return { success: true, data: res.data.getUserRecentActivities };
    }
    return res as unknown as ApiResponse<UserActivityItem[]>;
  }

  async getUserAchievements(): Promise<ApiResponse<UserAchievementItem[]>> {
    const res = await this.query<{
      getUserAchievements: UserAchievementItem[];
    }>(GET_USER_ACHIEVEMENTS);
    if (res.success && res.data?.getUserAchievements) {
      return { success: true, data: res.data.getUserAchievements };
    }
    return res as unknown as ApiResponse<UserAchievementItem[]>;
  }

  async getMonthlyActivityStats(
    year: number,
    month: number
  ): Promise<ApiResponse<MonthlyActivityStatsOutput>> {
    const res = await this.query<{
      getMonthlyActivityStats: MonthlyActivityStatsOutput;
    }>(GET_MONTHLY_ACTIVITY_STATS, { year, month });
    if (res.success && res.data?.getMonthlyActivityStats) {
      return { success: true, data: res.data.getMonthlyActivityStats };
    }
    return res as unknown as ApiResponse<MonthlyActivityStatsOutput>;
  }

  async getSavingsGoalProgress(): Promise<
    ApiResponse<SavingsGoalProgressOutput>
  > {
    const res = await this.query<{
      getSavingsGoalProgress: SavingsGoalProgressOutput;
    }>(GET_SAVINGS_GOAL_PROGRESS);
    if (res.success && res.data?.getSavingsGoalProgress) {
      return { success: true, data: res.data.getSavingsGoalProgress };
    }
    return res as unknown as ApiResponse<SavingsGoalProgressOutput>;
  }

  async getAdminUserDashboardData(
    targetUserId: number
  ): Promise<ApiResponse<UserDashboardData>> {
    const res = await this.query<{ getAdminUserDashboard: UserDashboardData }>(
      GET_ADMIN_USER_DASHBOARD_DATA,
      { targetUserId }
    );
    if (res.success && res.data?.getAdminUserDashboard) {
      return { success: true, data: res.data.getAdminUserDashboard };
    }
    return res as unknown as ApiResponse<UserDashboardData>;
  }

  async getAdminUserActivitiesV2(
    targetUserId: number,
    limit?: number
  ): Promise<ApiResponse<UserActivityItem[]>> {
    const res = await this.query<{
      getAdminUserActivities: UserActivityItem[];
    }>(GET_ADMIN_USER_ACTIVITIES_V2, { targetUserId, limit });
    if (res.success && res.data?.getAdminUserActivities) {
      return { success: true, data: res.data.getAdminUserActivities };
    }
    return res as unknown as ApiResponse<UserActivityItem[]>;
  }

  async getDashboardSummaryStats(): Promise<
    ApiResponse<UserDashboardSummaryStats>
  > {
    const res = await this.query<{
      getDashboardSummaryStats: UserDashboardSummaryStats;
    }>(GET_DASHBOARD_SUMMARY_STATS);
    if (res.success && res.data?.getDashboardSummaryStats) {
      return { success: true, data: res.data.getDashboardSummaryStats };
    }
    return res as unknown as ApiResponse<UserDashboardSummaryStats>;
  }

  async getVisitorStats(
    days?: number
  ): Promise<ApiResponse<VisitorStatsDetailed>> {
    const res = await this.query<{ getVisitorStats: VisitorStatsDetailed }>(
      GET_VISITOR_STATS,
      { days }
    );
    if (res.success && res.data?.getVisitorStats) {
      return { success: true, data: res.data.getVisitorStats };
    }
    return res as unknown as ApiResponse<VisitorStatsDetailed>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async setSavingsGoal(savingsGoal: string): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ setSavingsGoal: boolean }>(
      SET_SAVINGS_GOAL,
      {
        savingsGoal,
      }
    );
    if (res.success && res.data?.setSavingsGoal != null) {
      return { success: true, data: res.data.setSavingsGoal };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async setMonthlyTarget(monthlyTarget: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ setMonthlyTarget: boolean }>(
      SET_MONTHLY_TARGET,
      {
        monthlyTarget,
      }
    );
    if (res.success && res.data?.setMonthlyTarget != null) {
      return { success: true, data: res.data.setMonthlyTarget };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async cleanupVisitorData(
    days?: number
  ): Promise<ApiResponse<CleanupResultOutput>> {
    const res = await this.mutate<{ cleanupVisitorData: CleanupResultOutput }>(
      CLEANUP_VISITOR_DATA,
      { days }
    );
    if (res.success && res.data?.cleanupVisitorData) {
      return { success: true, data: res.data.cleanupVisitorData };
    }
    return res as unknown as ApiResponse<CleanupResultOutput>;
  }
}
