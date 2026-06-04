export const QUEUE_ROUTES = {
  LIST: '/admin/queue',
  CREATE: '/admin/queue/create',
  STATS: '/admin/queue/stats',
  DETAIL: '/admin/queue/:id',
  EDIT: '/admin/queue/:id/edit',
} as const;

export const QUEUE_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/queue\/([^/]+)$/,
  EDIT: /^\/admin\/queue\/([^/]+)\/edit$/,
} as const;
