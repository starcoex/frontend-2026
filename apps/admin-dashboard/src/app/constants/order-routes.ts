export const ORDER_ROUTES = {
  LIST: '/admin/orders',
  CREATE: '/admin/orders/create',
  DETAIL: '/admin/orders/:id',
  EDIT: '/admin/orders/:id/edit',
} as const;

export const ORDER_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/orders\/(\d+)$/,
  EDIT: /^\/admin\/orders\/(\d+)\/edit$/,
} as const;
