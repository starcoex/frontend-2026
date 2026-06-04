export const ANALYTICS_ROUTES = {
  ROOT: '/admin/analytics',
  OVERVIEW: '/admin/analytics',
  REALTIME: '/admin/analytics/realtime',
  RANKING: '/admin/analytics/ranking',
  SERVICE: '/admin/analytics/service',
  ADMIN: '/admin/analytics/admin',
} as const;

export const ANALYTICS_ROUTE_PATTERNS = {
  // 추후 사용자별 상세 분석 페이지 대비
  USER_DETAIL: /^\/admin\/analytics\/users\/(\d+)$/,
} as const;
