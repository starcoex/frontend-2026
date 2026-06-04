export const CART_ROUTES = {
  LIST: '/admin/cart',
  CREATE: '/admin/cart/create',
  DETAIL: '/admin/cart/:userId',
} as const;

export const CART_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/cart\/([^/]+)$/,
  CREATE: /^\/admin\/cart\/create$/,
} as const;
