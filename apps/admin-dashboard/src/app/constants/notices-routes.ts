export const NOTICES_ROUTES = {
  LIST: '/admin/notices',
  CREATE: '/admin/notices/create',
  DETAIL: '/admin/notices/:id',
  EDIT: '/admin/notices/:id/edit',
  MANUALS: '/admin/notices/manuals',
  MANUAL_CREATE: '/admin/notices/manuals/create',
  MANUAL_DETAIL: '/admin/notices/manuals/:id',
  MANUAL_EDIT: '/admin/notices/manuals/:id/edit',
  CATEGORIES: '/admin/notices/manuals/categories',
} as const;

export const NOTICES_ROUTE_PATTERNS = {
  NOTICE_DETAIL: /^\/admin\/notices\/(\d+)$/,
  NOTICE_EDIT: /^\/admin\/notices\/(\d+)\/edit$/,
  MANUAL_DETAIL: /^\/admin\/notices\/manuals\/(\d+)$/,
  MANUAL_EDIT: /^\/admin\/notices\/manuals\/(\d+)\/edit$/,
} as const;
