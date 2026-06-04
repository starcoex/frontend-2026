import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const PERSONAL_STATS_FIELDS = gql`
  fragment PersonalStatsFields on PersonalStatsOutput {
    totalSavings
    totalAmount
    totalEvents
    lastActivity
    lastService
  }
`;

export const TODAY_ACTIVITY_FIELDS = gql`
  fragment TodayActivityFields on TodayActivityOutput {
    orders
    savings
    lastOrder
  }
`;

export const LIVE_RANKING_FIELDS = gql`
  fragment LiveRankingFields on LiveRankingOutput {
    currentRank
    change
  }
`;

export const REALTIME_ALERT_FIELDS = gql`
  fragment RealtimeAlertFields on RealtimeAlertOutput {
    userId
    type
    message
    data
    timestamp
    isRead
    severity
  }
`;

export const SYSTEM_STATUS_FIELDS = gql`
  fragment SystemStatusFields on SystemStatusOutput {
    dataFreshness
    processingDelay
    healthScore
  }
`;

export const REALTIME_STATS_FIELDS = gql`
  ${TODAY_ACTIVITY_FIELDS}
  ${LIVE_RANKING_FIELDS}
  ${REALTIME_ALERT_FIELDS}
  ${SYSTEM_STATUS_FIELDS}
  fragment RealtimeStatsFields on RealtimeStatsOutput {
    totalSavings
    totalAmount
    totalOrders
    todayActivity {
      ...TodayActivityFields
    }
    liveRanking {
      ...LiveRankingFields
    }
    recentAlerts {
      ...RealtimeAlertFields
    }
    systemStatus {
      ...SystemStatusFields
    }
  }
`;

export const SERVICE_BREAKDOWN_FIELDS = gql`
  fragment ServiceBreakdownFields on ServiceBreakdownOutput {
    service
    serviceName
    totalOrders
    totalAmount
    totalSavings
    lastUsed
    averageOrderAmount
    averageSavingsPerOrder
    percentage
    trend
    status
  }
`;

export const RECENT_ACTIVITY_FIELDS = gql`
  fragment RecentActivityFields on RecentActivityOutput {
    eventType
    action
    amount
    timestamp
    metadata
  }
`;

export const TOP_USER_FIELDS = gql`
  fragment TopUserFields on TopUserOutput {
    userId
    totalAmount
    orderCount
  }
`;

export const USER_DASHBOARD_STATS_FIELDS = gql`
  ${RECENT_ACTIVITY_FIELDS}
  fragment UserDashboardStatsFields on UserDashboardStatsOutput {
    userId
    totalOrders
    totalSpent
    totalSavings
    loyaltyStars
    loyaltyTier
    lastActivity
    recentActivities {
      ...RecentActivityFields
    }
    realtimeStats
  }
`;

export const ADMIN_DASHBOARD_STATS_FIELDS = gql`
  ${TOP_USER_FIELDS}
  fragment AdminDashboardStatsFields on AdminDashboardStatsOutput {
    totalUsers
    activeUsersToday
    totalRevenueToday
    totalOrdersToday
    topUsers {
      ...TopUserFields
    }
    hourlyStats
  }
`;

export const USER_ACTIVITY_OUTPUT_FIELDS = gql`
  fragment UserActivityOutputFields on UserActivityOutput {
    id
    userId
    service
    eventType
    action
    amount
    savings
    timestamp
    eventData
  }
`;

export const LEADERBOARD_ENTRY_FIELDS = gql`
  fragment LeaderboardEntryFields on LeaderboardEntryOutput {
    rank
    userId
    score
    savings
    percentile
    anonymousName
    badge
  }
`;

export const RANKING_DETAIL_FIELDS = gql`
  fragment RankingDetailFields on RankingDetailOutput {
    rank
    score
    percentile
    totalUsers
    message
    badge
  }
`;

export const USER_LEADERBOARD_ENTRY_FIELDS = gql`
  fragment UserLeaderboardEntryFields on UserLeaderboardEntryOutput {
    rank
    anonymousName
    savings
    badge
  }
`;

export const USER_RANKING_FIELDS = gql`
  ${RANKING_DETAIL_FIELDS}
  ${USER_LEADERBOARD_ENTRY_FIELDS}
  fragment UserRankingFields on UserRankingOutput {
    total {
      ...RankingDetailFields
    }
    monthly {
      ...RankingDetailFields
    }
    leaderboard {
      ...UserLeaderboardEntryFields
    }
  }
`;

export const USER_DASHBOARD_OVERVIEW_FIELDS = gql`
  fragment UserDashboardOverviewFields on UserDashboardOverview {
    userId
    totalSavings
    totalAmount
    totalEvents
    favoriteService
    lastActivityService
    lastActivity
    savingsGoal
    membershipLevel
  }
`;

export const USER_SERVICE_STATS_FIELDS = gql`
  fragment UserServiceStatsFields on UserServiceStats {
    service
    totalAmount
    totalSavings
    usageCount
    lastUsed
  }
`;

export const USER_ACTIVITY_ITEM_FIELDS = gql`
  fragment UserActivityItemFields on UserActivityItem {
    id
    userId
    service
    eventType
    action
    amount
    savings
    timestamp
    createdAt
  }
`;

export const USER_ACHIEVEMENT_ITEM_FIELDS = gql`
  fragment UserAchievementItemFields on UserAchievementItem {
    id
    userId
    type
    level
    title
    description
    isCompleted
    completedAt
    createdAt
  }
`;

export const USER_DASHBOARD_DATA_FIELDS = gql`
  ${USER_DASHBOARD_OVERVIEW_FIELDS}
  ${USER_SERVICE_STATS_FIELDS}
  ${USER_ACTIVITY_ITEM_FIELDS}
  ${USER_ACHIEVEMENT_ITEM_FIELDS}
  fragment UserDashboardDataFields on UserDashboardData {
    overview {
      ...UserDashboardOverviewFields
    }
    serviceStats {
      ...UserServiceStatsFields
    }
    recentActivities {
      ...UserActivityItemFields
    }
    achievements {
      ...UserAchievementItemFields
    }
  }
`;

export const SAVINGS_GOAL_PROGRESS_FIELDS = gql`
  fragment SavingsGoalProgressFields on SavingsGoalProgressOutput {
    savingsGoal
    currentSavings
    progressPercentage
    remainingAmount
    message
  }
`;

export const MONTHLY_ACTIVITY_STATS_FIELDS = gql`
  fragment MonthlyActivityStatsFields on MonthlyActivityStatsOutput {
    totalAmount
    totalSavings
    totalEvents
    serviceBreakdown
  }
`;

export const ANALYTICS_SUMMARY_STATS_FIELDS = gql`
  fragment AnalyticsSummaryStatsFields on AnalyticsSummaryStats {
    totalUsers
    activeUsersToday
    activeUsersThisMonth
    totalActivities
    todayActivities
    deletedActivities
    totalRevenue
    todayRevenue
    totalSavings
  }
`;

export const TOP_SAVER_FIELDS = gql`
  fragment TopSaverFields on TopSaverOutput {
    userId
    totalSavings
    totalAmount
  }
`;

export const USER_DASHBOARD_SUMMARY_STATS_FIELDS = gql`
  ${TOP_SAVER_FIELDS}
  fragment UserDashboardSummaryStatsFields on UserDashboardSummaryStats {
    totalUsers
    totalSavings
    totalAmount
    totalEvents
    avgSavingsPerUser
    avgAmountPerUser
    completedAchievements
    totalAchievements
    topSavers {
      ...TopSaverFields
    }
  }
`;

export const VISITOR_STATS_DETAILED_FIELDS = gql`
  fragment VisitorStatsDetailedFields on VisitorStatsDetailed {
    totalVisitors
    newVisitors
    returningVisitors
    dailyBreakdown
    averageVisitorsPerDay
    hourlyStats
  }
`;

export const REALTIME_SUMMARY_STATS_FIELDS = gql`
  fragment RealtimeSummaryStatsFields on RealtimeSummaryStats {
    totalUsersInLeaderboard
    totalMonthlyUsers
    top1Score
    top3Score
    activeRedisKeys
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GET_PERSONAL_STATS = gql`
  ${PERSONAL_STATS_FIELDS}
  query GetPersonalStats {
    getPersonalStats {
      ...PersonalStatsFields
    }
  }
`;

export const GET_SERVICE_BREAKDOWN = gql`
  ${SERVICE_BREAKDOWN_FIELDS}
  query GetServiceBreakdown($services: [String!]) {
    getServiceBreakdown(services: $services) {
      ...ServiceBreakdownFields
    }
  }
`;

export const GET_USER_DASHBOARD = gql`
  ${USER_DASHBOARD_STATS_FIELDS}
  query UserDashboard {
    userDashboard {
      ...UserDashboardStatsFields
    }
  }
`;

export const GET_USER_ACTIVITIES = gql`
  ${USER_ACTIVITY_OUTPUT_FIELDS}
  query UserActivities($limit: Int) {
    userActivities(limit: $limit) {
      ...UserActivityOutputFields
    }
  }
`;

export const GET_ADMIN_DASHBOARD = gql`
  ${ADMIN_DASHBOARD_STATS_FIELDS}
  query AdminDashboard {
    adminDashboard {
      ...AdminDashboardStatsFields
    }
  }
`;

export const GET_ANALYTICS_SUMMARY_STATS = gql`
  ${ANALYTICS_SUMMARY_STATS_FIELDS}
  query AnalyticsSummaryStats {
    analyticsSummaryStats {
      ...AnalyticsSummaryStatsFields
    }
  }
`;

export const GET_ADMIN_USER_DASHBOARD = gql`
  ${USER_DASHBOARD_STATS_FIELDS}
  query AdminUserDashboard($targetUserId: Int!) {
    adminUserDashboard(targetUserId: $targetUserId) {
      ...UserDashboardStatsFields
    }
  }
`;

export const GET_ADMIN_USER_ACTIVITIES = gql`
  ${USER_ACTIVITY_OUTPUT_FIELDS}
  query AdminUserActivities($targetUserId: Int!, $limit: Int) {
    adminUserActivities(targetUserId: $targetUserId, limit: $limit) {
      ...UserActivityOutputFields
    }
  }
`;

export const GET_GLOBAL_LEADERBOARD = gql`
  ${LEADERBOARD_ENTRY_FIELDS}
  query GetGlobalLeaderboard($limit: Int, $category: String) {
    getGlobalLeaderboard(limit: $limit, category: $category) {
      ...LeaderboardEntryFields
    }
  }
`;

export const GET_USER_RANKING = gql`
  ${USER_RANKING_FIELDS}
  query GetUserRanking {
    getUserRanking {
      ...UserRankingFields
    }
  }
`;

export const GET_REALTIME_STATS = gql`
  ${REALTIME_STATS_FIELDS}
  query GetRealtimeStats {
    getRealtimeStats {
      ...RealtimeStatsFields
    }
  }
`;

export const GET_ADMIN_USER_REALTIME_STATS = gql`
  ${REALTIME_STATS_FIELDS}
  query GetAdminUserRealtimeStats($targetUserId: Int!) {
    getAdminUserRealtimeStats(targetUserId: $targetUserId) {
      ...RealtimeStatsFields
    }
  }
`;

export const GET_REALTIME_SUMMARY_STATS = gql`
  ${REALTIME_SUMMARY_STATS_FIELDS}
  query GetRealtimeSummaryStats {
    getRealtimeSummaryStats {
      ...RealtimeSummaryStatsFields
    }
  }
`;

export const GET_USER_DASHBOARD_DATA = gql`
  ${USER_DASHBOARD_DATA_FIELDS}
  query GetUserDashboard($query: UserDashboardQueryInput) {
    getUserDashboard(query: $query) {
      ...UserDashboardDataFields
    }
  }
`;

export const GET_USER_OVERVIEW = gql`
  ${USER_DASHBOARD_OVERVIEW_FIELDS}
  query GetUserOverview {
    getUserOverview {
      ...UserDashboardOverviewFields
    }
  }
`;

export const GET_USER_SERVICE_STATS = gql`
  ${USER_SERVICE_STATS_FIELDS}
  query GetUserServiceStats($serviceFilter: String) {
    getUserServiceStats(serviceFilter: $serviceFilter) {
      ...UserServiceStatsFields
    }
  }
`;

export const GET_USER_RECENT_ACTIVITIES = gql`
  ${USER_ACTIVITY_ITEM_FIELDS}
  query GetUserRecentActivities($limit: Int) {
    getUserRecentActivities(limit: $limit) {
      ...UserActivityItemFields
    }
  }
`;

export const GET_USER_ACHIEVEMENTS = gql`
  ${USER_ACHIEVEMENT_ITEM_FIELDS}
  query GetUserAchievements {
    getUserAchievements {
      ...UserAchievementItemFields
    }
  }
`;

export const GET_MONTHLY_ACTIVITY_STATS = gql`
  ${MONTHLY_ACTIVITY_STATS_FIELDS}
  query GetMonthlyActivityStats($year: Int!, $month: Int!) {
    getMonthlyActivityStats(year: $year, month: $month) {
      ...MonthlyActivityStatsFields
    }
  }
`;

export const GET_SAVINGS_GOAL_PROGRESS = gql`
  ${SAVINGS_GOAL_PROGRESS_FIELDS}
  query GetSavingsGoalProgress {
    getSavingsGoalProgress {
      ...SavingsGoalProgressFields
    }
  }
`;

export const GET_ADMIN_USER_DASHBOARD_DATA = gql`
  ${USER_DASHBOARD_DATA_FIELDS}
  query GetAdminUserDashboard($targetUserId: Int!) {
    getAdminUserDashboard(targetUserId: $targetUserId) {
      ...UserDashboardDataFields
    }
  }
`;

export const GET_ADMIN_USER_ACTIVITIES_V2 = gql`
  ${USER_ACTIVITY_ITEM_FIELDS}
  query GetAdminUserActivities($targetUserId: Int!, $limit: Int) {
    getAdminUserActivities(targetUserId: $targetUserId, limit: $limit) {
      ...UserActivityItemFields
    }
  }
`;

export const GET_DASHBOARD_SUMMARY_STATS = gql`
  ${USER_DASHBOARD_SUMMARY_STATS_FIELDS}
  query GetDashboardSummaryStats {
    getDashboardSummaryStats {
      ...UserDashboardSummaryStatsFields
    }
  }
`;

export const GET_VISITOR_STATS = gql`
  ${VISITOR_STATS_DETAILED_FIELDS}
  query GetVisitorStats($days: Int) {
    getVisitorStats(days: $days) {
      ...VisitorStatsDetailedFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const SET_SAVINGS_GOAL = gql`
  mutation SetSavingsGoal($savingsGoal: String!) {
    setSavingsGoal(savingsGoal: $savingsGoal)
  }
`;

export const SET_MONTHLY_TARGET = gql`
  mutation SetMonthlyTarget($monthlyTarget: Int!) {
    setMonthlyTarget(monthlyTarget: $monthlyTarget)
  }
`;

export const CLEANUP_VISITOR_DATA = gql`
  mutation CleanupVisitorData($days: Int) {
    cleanupVisitorData(days: $days) {
      deletedVisitors
      deletedSummaries
      success
    }
  }
`;

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const REALTIME_ALERTS_SUBSCRIPTION = gql`
  ${REALTIME_ALERT_FIELDS}
  subscription RealtimeAlerts($userId: Int) {
    realtimeAlerts(userId: $userId) {
      ...RealtimeAlertFields
    }
  }
`;
