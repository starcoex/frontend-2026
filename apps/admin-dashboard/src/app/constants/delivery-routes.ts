export const DELIVERY_ROUTES = {
  LIST: '/admin/delivery',
  CREATE: '/admin/delivery/create',
  DRIVERS: '/admin/delivery/drivers',
  DRIVERS_CREATE: '/admin/delivery/drivers/create',
  TRACKING: '/admin/delivery/tracking',
  SETTLEMENTS: '/admin/delivery/settlements', // ✅ 신규
  PRICING: '/admin/delivery/pricing', // ✅ 신규
  DETAIL: '/admin/delivery/:id',
  EDIT: '/admin/delivery/:id/edit',
} as const;

export const DELIVERY_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/delivery\/([^/]+)$/,
  EDIT: /^\/admin\/delivery\/([^/]+)\/edit$/,
} as const;
