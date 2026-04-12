export const DRIVER_ROUTES = {
  DASHBOARD: '/admin/driver/dashboard',
  DELIVERIES: '/admin/driver/deliveries',
  ACTIVE: '/admin/driver/active',
  PROFILE: '/admin/driver/profile',
} as const;

export const DRIVER_ROUTE_PATTERNS = {
  ACTIVE: /^\/admin\/driver\/active$/,
  DELIVERIES: /^\/admin\/driver\/deliveries$/,
} as const;
