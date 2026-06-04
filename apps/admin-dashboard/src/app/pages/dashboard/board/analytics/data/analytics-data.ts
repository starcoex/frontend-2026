export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

// ============================================================================
// 랭킹 배지
// ============================================================================

export type RankingBadge = 'diamond' | 'gold' | 'silver' | 'bronze' | 'newbie';

export const RANKING_BADGE_CONFIG: Record<
  RankingBadge,
  { label: string; variant: BadgeVariant; className: string }
> = {
  diamond: {
    label: '다이아몬드',
    variant: 'default',
    className:
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  gold: {
    label: '골드',
    variant: 'default',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  silver: {
    label: '실버',
    variant: 'secondary',
    className:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  bronze: {
    label: '브론즈',
    variant: 'outline',
    className:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  newbie: {
    label: '신규',
    variant: 'outline',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
};

export const RANKING_BADGE_OPTIONS = (
  Object.entries(RANKING_BADGE_CONFIG) as [
    RankingBadge,
    (typeof RANKING_BADGE_CONFIG)[RankingBadge]
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// 실시간 알림 Severity
// ============================================================================

export type AlertSeverity = 'critical' | 'warning' | 'info';

export const ALERT_SEVERITY_CONFIG: Record<
  AlertSeverity,
  { label: string; variant: BadgeVariant; className: string }
> = {
  critical: {
    label: '긴급',
    variant: 'destructive',
    className: 'border-red-500 bg-red-50 dark:bg-red-950/20',
  },
  warning: {
    label: '경고',
    variant: 'warning',
    className: 'border-orange-400 bg-orange-50 dark:bg-orange-950/20',
  },
  info: {
    label: '정보',
    variant: 'default',
    className: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20',
  },
};

export const ALERT_SEVERITY_FILTER_OPTIONS = (
  Object.entries(ALERT_SEVERITY_CONFIG) as [
    AlertSeverity,
    (typeof ALERT_SEVERITY_CONFIG)[AlertSeverity]
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// 서비스 분석 트렌드
// ============================================================================

export type ServiceTrend = 'up' | 'down' | 'stable';

export const SERVICE_TREND_CONFIG: Record<
  ServiceTrend,
  { label: string; variant: BadgeVariant; className: string }
> = {
  up: {
    label: '증가',
    variant: 'success',
    className: 'text-emerald-600',
  },
  down: {
    label: '감소',
    variant: 'destructive',
    className: 'text-red-500',
  },
  stable: {
    label: '안정',
    variant: 'secondary',
    className: 'text-muted-foreground',
  },
};

export const SERVICE_TREND_FILTER_OPTIONS = (
  Object.entries(SERVICE_TREND_CONFIG) as [
    ServiceTrend,
    (typeof SERVICE_TREND_CONFIG)[ServiceTrend]
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// 서비스 상태
// ============================================================================

export type ServiceStatus = 'active' | 'inactive';

export const SERVICE_STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: { label: '활성', variant: 'success' },
  inactive: { label: '비활성', variant: 'secondary' },
};

export const SERVICE_STATUS_FILTER_OPTIONS = (
  Object.entries(SERVICE_STATUS_CONFIG) as [
    ServiceStatus,
    (typeof SERVICE_STATUS_CONFIG)[ServiceStatus]
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// 업적 레벨
// ============================================================================

export type AchievementLevel = 'diamond' | 'gold' | 'silver' | 'bronze';

export const ACHIEVEMENT_LEVEL_CONFIG: Record<
  AchievementLevel,
  { label: string; variant: BadgeVariant }
> = {
  diamond: { label: '다이아몬드', variant: 'default' },
  gold: { label: '골드', variant: 'default' },
  silver: { label: '실버', variant: 'secondary' },
  bronze: { label: '브론즈', variant: 'outline' },
};

export const ACHIEVEMENT_LEVEL_FILTER_OPTIONS = (
  Object.entries(ACHIEVEMENT_LEVEL_CONFIG) as [
    AchievementLevel,
    (typeof ACHIEVEMENT_LEVEL_CONFIG)[AchievementLevel]
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// 리더보드 카테고리
// ============================================================================

export const LEADERBOARD_CATEGORY_OPTIONS = [
  { value: 'total', label: '전체' },
  { value: 'monthly', label: '월간' },
  { value: 'weekly', label: '주간' },
] as const;

export type LeaderboardCategory =
  (typeof LEADERBOARD_CATEGORY_OPTIONS)[number]['value'];

// ============================================================================
// 순위별 스타일 (1~3위 하이라이트)
// ============================================================================

export const RANK_STYLE_CONFIG: Record<number, string> = {
  1: 'text-yellow-500 font-bold',
  2: 'text-slate-400 font-bold',
  3: 'text-orange-500 font-bold',
};

export const getRankStyle = (rank: number): string =>
  RANK_STYLE_CONFIG[rank] ?? 'text-muted-foreground';

// ============================================================================
// 시스템 건강 점수
// ============================================================================

export const getHealthScoreConfig = (
  score: number
): { label: string; className: string; variant: BadgeVariant } => {
  if (score >= 80)
    return { label: '양호', className: 'text-emerald-500', variant: 'success' };
  if (score >= 50)
    return { label: '주의', className: 'text-orange-500', variant: 'warning' };
  return { label: '위험', className: 'text-red-500', variant: 'destructive' };
};

// ============================================================================
// 방문자 통계 기간 옵션
// ============================================================================

export const VISITOR_STATS_PERIOD_OPTIONS = [
  { value: 7, label: '최근 7일' },
  { value: 14, label: '최근 14일' },
  { value: 30, label: '최근 30일' },
] as const;

export type VisitorStatsPeriod =
  (typeof VISITOR_STATS_PERIOD_OPTIONS)[number]['value'];
