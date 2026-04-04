export const CART_ROUTES = {
  LIST: '/admin/cart',
  DETAIL: '/admin/cart/:userId',
} as const;

export const CART_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/cart\/([^/]+)$/,
} as const;
