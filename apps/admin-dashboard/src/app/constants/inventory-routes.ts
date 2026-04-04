export const INVENTORY_ROUTES = {
  LIST: '/admin/inventory',
  LOW_STOCK: '/admin/inventory/low-stock',
  CREATE: '/admin/inventory/create',
  DETAIL: '/admin/inventory/:id',
  EDIT: '/admin/inventory/:id/edit',
} as const;

export const INVENTORY_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/inventory\/([^/]+)$/,
  EDIT: /^\/admin\/inventory\/([^/]+)\/edit$/,
} as const;
