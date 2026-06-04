export const REVIEW_ROUTES = {
  LIST: '/admin/reviews',
  CREATE: '/admin/reviews/create',
  SCOPES: '/admin/reviews/scopes',
  EDIT: '/admin/reviews/:id/edit',
  DETAIL: '/admin/reviews/:id',
} as const;

export const REVIEW_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/reviews\/([^/]+)\/edit$/,
  DETAIL: /^\/admin\/reviews\/([^/]+)$/,
} as const;
