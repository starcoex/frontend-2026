export const LOYALTY_ROUTES = {
  LIST: '/admin/loyalty',
  SETTINGS: '/admin/loyalty/settings',
  STAR_EVENTS: '/admin/loyalty/star-events',
  STAR_HISTORY: '/admin/loyalty/star-history',
  DETAIL: '/admin/loyalty/:userId',
} as const;

export const LOYALTY_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/loyalty\/([^/]+)$/,
} as const;
