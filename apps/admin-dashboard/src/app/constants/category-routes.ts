export const CATEGORY_ROUTES = {
  LIST: '/admin/categories',
  HIERARCHY: '/admin/categories/hierarchy',
  EDIT: '/admin/categories/:id/edit',
  DETAIL: '/admin/categories/:id',
} as const;

export const CATEGORY_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/categories\/(\d+)\/edit$/,
  DETAIL: /^\/admin\/categories\/(\d+)$/,
} as const;
