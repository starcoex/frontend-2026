export const DELIVERY_ROUTES = {
  LIST: '/admin/delivery',
  CREATE: '/admin/delivery/create',
  DRIVERS: '/admin/delivery/drivers',
  TRACKING: '/admin/delivery/tracking',
  DETAIL: '/admin/delivery/:id',
  EDIT: '/admin/delivery/:id/edit',
} as const;

export const DELIVERY_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/delivery\/([^/]+)$/,
  EDIT: /^\/admin\/delivery\/([^/]+)\/edit$/,
} as const;
