// ============================================================================
// 스칼라 / 공통
// ============================================================================

export type JSONValue = Record<string, unknown> | null;

// ============================================================================
// 엔티티
// ============================================================================

export interface PersonalStatsOutput {
  totalSavings: number;
  totalAmount: number;
  totalEvents: number;
  lastActivity?: string | null;
  lastService?: string | null;
}

export interface DailyUsageOutput {
  day: string;
  count: number;
}

export interface SavingsGoalProgressOutput {
  savingsGoal?: number | null;
  currentSavings: number;
  progressPercentage: number;
  remainingAmount: number;
  message?: string | null;
}

export interface ServiceBreakdownOutput {
  service: string;
  serviceName: string;
  totalOrders: number;
  totalAmount: number;
  totalSavings: number;
  lastUsed?: string | null;
  averageOrderAmount: number;
  averageSavingsPerOrder: number;
  percentage: number;
  trend: string;
  status: string;
}

export interface RecentActivityOutput {
  eventType: string;
  action: string;
  amount?: number | null;
  timestamp: string;
  metadata?: JSONValue;
}

export interface TopUserOutput {
  userId: number;
  totalAmount: number;
  orderCount: number;
}

export interface UserDashboardStatsOutput {
  userId: number;
  totalOrders: number;
  totalSpent: number;
  totalSavings: number;
  loyaltyStars: number;
  loyaltyTier: string;
  lastActivity: string;
  recentActivities: RecentActivityOutput[];
  realtimeStats?: JSONValue;
}

export interface AdminDashboardStatsOutput {
  totalUsers: number;
  activeUsersToday: number;
  totalRevenueToday: number;
  totalOrdersToday: number;
  topUsers: TopUserOutput[];
  hourlyStats: JSONValue;
}

export interface UserActivityOutput {
  id: number;
  userId: number;
  service: string;
  eventType: string;
  action: string;
  amount: number;
  savings: number;
  timestamp: string;
  eventData?: JSONValue;
}

export interface TodayActivityOutput {
  orders: number;
  savings: number;
  lastOrder?: string | null;
}

export interface LiveRankingOutput {
  currentRank: number;
  change: number;
}

export interface RealtimeAlertOutput {
  userId?: number | null;
  type: string;
  message: string;
  data?: JSONValue;
  timestamp: string;
  isRead: boolean;
  severity?: string | null;
}

export interface SystemStatusOutput {
  dataFreshness: string;
  processingDelay: number;
  healthScore: number;
}

export interface RealtimeStatsOutput {
  totalSavings: number;
  totalAmount: number;
  totalOrders: number;
  todayActivity: TodayActivityOutput;
  liveRanking: LiveRankingOutput;
  recentAlerts: RealtimeAlertOutput[];
  systemStatus: SystemStatusOutput;
}

export interface AnalyticsSummaryStats {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersThisMonth: number;
  totalActivities: number;
  todayActivities: number;
  deletedActivities: number;
  totalRevenue: number;
  todayRevenue: number;
  totalSavings: number;
}

export interface LeaderboardEntryOutput {
  rank: number;
  userId: number;
  score: number;
  savings: number;
  percentile: number;
  anonymousName: string;
  badge: string;
}

export interface RankingDetailOutput {
  rank?: number | null;
  score: number;
  percentile?: number | null;
  totalUsers: number;
  message?: string | null;
  badge?: string | null;
}

export interface UserLeaderboardEntryOutput {
  rank: number;
  anonymousName: string;
  savings: number;
  badge: string;
}

export interface UserRankingOutput {
  total: RankingDetailOutput;
  monthly: RankingDetailOutput;
  leaderboard?: UserLeaderboardEntryOutput[] | null;
}

export interface RealtimeSummaryStats {
  totalUsersInLeaderboard: number;
  totalMonthlyUsers: number;
  top1Score: number;
  top3Score: number;
  activeRedisKeys: number;
}

export interface UserDashboardOverview {
  userId: number;
  totalSavings: number;
  totalAmount: number;
  totalEvents: number;
  favoriteService?: string | null;
  lastActivityService?: string | null;
  lastActivity: string;
  savingsGoal?: string | null;
  membershipLevel: string;
}

export interface UserServiceStats {
  service: string;
  totalAmount: number;
  totalSavings: number;
  usageCount: number;
  lastUsed: string;
}

export interface UserActivityItem {
  id: number;
  userId: number;
  service: string;
  eventType: string;
  action: string;
  amount?: number | null;
  savings?: number | null;
  timestamp: string;
  createdAt: string;
}

export interface UserAchievementItem {
  id: number;
  userId: number;
  type: string;
  level: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
}

export interface UserDashboardData {
  overview: UserDashboardOverview;
  serviceStats: UserServiceStats[];
  recentActivities: UserActivityItem[];
  achievements: UserAchievementItem[];
}

export interface MonthlyActivityStatsOutput {
  totalAmount: number;
  totalSavings: number;
  totalEvents: number;
  serviceBreakdown: string;
}

export interface TopSaverOutput {
  userId: number;
  totalSavings: number;
  totalAmount: number;
}

export interface UserDashboardSummaryStats {
  totalUsers: number;
  totalSavings: number;
  totalAmount: number;
  totalEvents: number;
  avgSavingsPerUser: number;
  avgAmountPerUser: number;
  completedAchievements: number;
  totalAchievements: number;
  topSavers: TopSaverOutput[];
}

export interface VisitorStatsDetailed {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  dailyBreakdown: string;
  averageVisitorsPerDay: number;
  hourlyStats: string;
}

export interface CleanupResultOutput {
  deletedVisitors: number;
  deletedSummaries: number;
  success: boolean;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface UserDashboardQueryInput {
  userId: number;
  activityLimit?: number | null;
  serviceFilter?: string | null;
  includeAchievements?: boolean | null;
  includePatterns?: boolean | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IAnalyticsService {
  getPersonalStats(): Promise<
    import('../types').ApiResponse<PersonalStatsOutput>
  >;
  getServiceBreakdown(
    services?: string[]
  ): Promise<import('../types').ApiResponse<ServiceBreakdownOutput[]>>;
  getUserDashboard(): Promise<
    import('../types').ApiResponse<UserDashboardStatsOutput>
  >;
  getUserActivities(
    limit?: number
  ): Promise<import('../types').ApiResponse<UserActivityOutput[]>>;
  getAdminDashboard(): Promise<
    import('../types').ApiResponse<AdminDashboardStatsOutput>
  >;
  getAnalyticsSummaryStats(): Promise<
    import('../types').ApiResponse<AnalyticsSummaryStats>
  >;
  getAdminUserDashboard(
    targetUserId: number
  ): Promise<import('../types').ApiResponse<UserDashboardStatsOutput>>;
  getAdminUserActivities(
    targetUserId: number,
    limit?: number
  ): Promise<import('../types').ApiResponse<UserActivityOutput[]>>;
  getGlobalLeaderboard(
    limit?: number,
    category?: string
  ): Promise<import('../types').ApiResponse<LeaderboardEntryOutput[]>>;
  getUserRanking(): Promise<import('../types').ApiResponse<UserRankingOutput>>;
  getRealtimeStats(): Promise<
    import('../types').ApiResponse<RealtimeStatsOutput>
  >;
  getAdminUserRealtimeStats(
    targetUserId: number
  ): Promise<import('../types').ApiResponse<RealtimeStatsOutput>>;
  getRealtimeSummaryStats(): Promise<
    import('../types').ApiResponse<RealtimeSummaryStats>
  >;
  getUserDashboardData(
    query?: UserDashboardQueryInput
  ): Promise<import('../types').ApiResponse<UserDashboardData>>;
  getUserOverview(): Promise<
    import('../types').ApiResponse<UserDashboardOverview>
  >;
  getUserServiceStats(
    serviceFilter?: string
  ): Promise<import('../types').ApiResponse<UserServiceStats[]>>;
  getUserRecentActivities(
    limit?: number
  ): Promise<import('../types').ApiResponse<UserActivityItem[]>>;
  getUserAchievements(): Promise<
    import('../types').ApiResponse<UserAchievementItem[]>
  >;
  getMonthlyActivityStats(
    year: number,
    month: number
  ): Promise<import('../types').ApiResponse<MonthlyActivityStatsOutput>>;
  getSavingsGoalProgress(): Promise<
    import('../types').ApiResponse<SavingsGoalProgressOutput>
  >;
  getAdminUserDashboardData(
    targetUserId: number
  ): Promise<import('../types').ApiResponse<UserDashboardData>>;
  getAdminUserActivitiesV2(
    targetUserId: number,
    limit?: number
  ): Promise<import('../types').ApiResponse<UserActivityItem[]>>;
  getDashboardSummaryStats(): Promise<
    import('../types').ApiResponse<UserDashboardSummaryStats>
  >;
  getVisitorStats(
    days?: number
  ): Promise<import('../types').ApiResponse<VisitorStatsDetailed>>;
  setSavingsGoal(
    savingsGoal: string
  ): Promise<import('../types').ApiResponse<boolean>>;
  setMonthlyTarget(
    monthlyTarget: number
  ): Promise<import('../types').ApiResponse<boolean>>;
  cleanupVisitorData(
    days?: number
  ): Promise<import('../types').ApiResponse<CleanupResultOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface AnalyticsState {
  personalStats: PersonalStatsOutput | null;
  serviceBreakdown: ServiceBreakdownOutput[];
  userDashboardStats: UserDashboardStatsOutput | null;
  userActivities: UserActivityOutput[];
  adminDashboardStats: AdminDashboardStatsOutput | null;
  analyticsSummaryStats: AnalyticsSummaryStats | null;
  globalLeaderboard: LeaderboardEntryOutput[];
  userRanking: UserRankingOutput | null;
  realtimeStats: RealtimeStatsOutput | null;
  realtimeSummaryStats: RealtimeSummaryStats | null;
  userDashboardData: UserDashboardData | null;
  userOverview: UserDashboardOverview | null;
  userServiceStats: UserServiceStats[];
  userRecentActivities: UserActivityItem[];
  userAchievements: UserAchievementItem[];
  savingsGoalProgress: SavingsGoalProgressOutput | null;
  dashboardSummaryStats: UserDashboardSummaryStats | null;
  visitorStats: VisitorStatsDetailed | null;
  isLoading: boolean;
  error: string | null;
}

export interface AnalyticsContextActions {
  setPersonalStats: (stats: PersonalStatsOutput | null) => void;
  setServiceBreakdown: (breakdown: ServiceBreakdownOutput[]) => void;
  setUserDashboardStats: (stats: UserDashboardStatsOutput | null) => void;
  setUserActivities: (activities: UserActivityOutput[]) => void;
  setAdminDashboardStats: (stats: AdminDashboardStatsOutput | null) => void;
  setAnalyticsSummaryStats: (stats: AnalyticsSummaryStats | null) => void;
  setGlobalLeaderboard: (leaderboard: LeaderboardEntryOutput[]) => void;
  setUserRanking: (ranking: UserRankingOutput | null) => void;
  setRealtimeStats: (stats: RealtimeStatsOutput | null) => void;
  setRealtimeSummaryStats: (stats: RealtimeSummaryStats | null) => void;
  setUserDashboardData: (data: UserDashboardData | null) => void;
  setUserOverview: (overview: UserDashboardOverview | null) => void;
  setUserServiceStats: (stats: UserServiceStats[]) => void;
  setUserRecentActivities: (activities: UserActivityItem[]) => void;
  setUserAchievements: (achievements: UserAchievementItem[]) => void;
  setSavingsGoalProgress: (progress: SavingsGoalProgressOutput | null) => void;
  setDashboardSummaryStats: (stats: UserDashboardSummaryStats | null) => void;
  setVisitorStats: (stats: VisitorStatsDetailed | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type AnalyticsContextValue = AnalyticsState & AnalyticsContextActions;
