export const INVENTORY_ROUTES = {
  LIST: '/admin/inventory',
  LOW_STOCK: '/admin/inventory/low-stock',
  CREATE: '/admin/inventory/create', // ← 추가
  DETAIL: '/admin/inventory/:id',
  EDIT: '/admin/inventory/:id/edit', // 신규
} as const;

export const INVENTORY_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/inventory\/([^/]+)$/,
  EDIT: /^\/admin\/inventory\/([^/]+)\/edit$/, // 신규
} as const;
