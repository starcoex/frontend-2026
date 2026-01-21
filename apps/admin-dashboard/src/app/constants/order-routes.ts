export const ORDER_ROUTES = {
  LIST: '/admin/orders',
  CREATE: '/admin/orders/create',
  DETAIL: '/admin/orders/:id',
} as const;

export const ORDER_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/orders\/([^/]+)$/,
} as const;
