export const STORE_ROUTES = {
  LIST: '/admin/stores',
  CREATE: '/admin/stores/create',
  EDIT: '/admin/stores/:id/edit',
  DETAIL: '/admin/stores/:id',
  BRANDS: '/admin/stores/brands',
  BRANDS_CREATE: '/admin/stores/brands/create',
} as const;

export const STORE_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/stores\/([^/]+)\/edit$/,
  DETAIL: /^\/admin\/stores\/([^/]+)$/,
} as const;
