export const INVENTORY_ROUTES = {
  LIST: '/admin/inventory',
  LOW_STOCK: '/admin/inventory/low-stock',
  DETAIL: '/admin/inventory/:id',
} as const;

export const INVENTORY_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/inventory\/([^/]+)$/,
} as const;
