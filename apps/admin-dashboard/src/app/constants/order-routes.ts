export const ORDER_ROUTES = {
  LIST: '/admin/orders',
  CREATE: '/admin/orders/create',
  STATS: '/admin/orders/stats',
  DETAIL: '/admin/orders/:id',
  EDIT: '/admin/orders/:id/edit',
} as const;

export const ORDER_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/orders\/([^/]+)\/edit$/,
  DETAIL: /^\/admin\/orders\/([^/]+)$/,
} as const;
