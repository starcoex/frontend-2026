export const ADDRESS_ROUTES = {
  LIST: '/admin/addresses',
  CREATE: '/admin/addresses/create',
  STATS: '/admin/addresses/stats',
  LOGS: '/admin/addresses/logs',
  DETAIL: '/admin/addresses/:id',
} as const;

export const ADDRESS_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/addresses\/(?!create$|stats$|logs$)(\d+)$/,
} as const;
