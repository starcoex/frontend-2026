export const PAYMENT_ROUTES = {
  LIST: '/admin/payments',
  CREATE: '/admin/payments/create',
  STATS: '/admin/payments/stats',
  DETAIL: '/admin/payments/:portOneId',
} as const;

// create, stats 는 제외하고 나머지 동적 경로만 매칭
export const PAYMENT_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/payments\/(?!create$|stats$)([^/]+)$/,
} as const;
