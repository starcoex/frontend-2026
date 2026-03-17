export const PRODUCT_ROUTES = {
  LIST: '/admin/products',
  CREATE: '/admin/products/create',
  SCAN: '/admin/products/scan', // ✅ 추가
  EDIT: '/admin/products/:id/edit',
  DETAIL: '/admin/products/:id',
} as const;

export const PRODUCT_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/products\/([^/]+)\/edit$/,
  DETAIL: /^\/admin\/products\/([^/]+)$/,
} as const;
