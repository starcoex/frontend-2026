export const PROMOTION_ROUTES = {
  LIST: '/admin/promotions',
  CREATE: '/admin/promotions/create',
  EDIT: '/admin/promotions/:id/edit',
  DETAIL: '/admin/promotions/:id',
} as const;

export const PROMOTION_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/promotions\/([^/]+)\/edit$/,
  DETAIL: /^\/admin\/promotions\/([^/]+)$/,
} as const;
