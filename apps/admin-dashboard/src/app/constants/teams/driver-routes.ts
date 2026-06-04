export const DRIVER_ROUTES = {
  DASHBOARD: '/admin/driver/dashboard',
  DELIVERIES: '/admin/driver/deliveries',
  ACTIVE: '/admin/driver/active',
  PROFILE: '/admin/driver/profile',
  SETTLEMENTS: '/admin/driver/settlements',
  SUGGESTIONS: '/admin/suggestions', // ✅ 신규 — DriverWithProvider 밖 경로
} as const;

export const DRIVER_ROUTE_PATTERNS = {
  ACTIVE: /^\/admin\/driver\/active$/,
  DELIVERIES: /^\/admin\/driver\/deliveries$/,
  SETTLEMENTS: /^\/admin\/driver\/settlements/,
  SUGGESTIONS: /^\/admin\/suggestions/, // ✅ 신규
} as const;
