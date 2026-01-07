export const USER_ROUTES = {
  LIST: '/admin/users',
  CREATE: '/admin/users/create',
  DETAIL: (id: string | number) => `/admin/users/${id}`,
  EDIT: (id: string | number) => `/admin/users/${id}/edit`,
  ADMINS: '/admin/users/admins',
  MEMBERS: '/admin/users/members',
  DRIVERS: '/admin/users/drivers',
} as const;

// ✅ 정규식 패턴 상수
export const USER_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/users\/(\d+)$/,
  EDIT: /^\/admin\/users\/([^/]+)\/edit$/,
} as const;
