export const USER_ROUTES = {
  LIST: '/admin/users',
  CREATE: '/admin/users/create',
  ADMINS: '/admin/users/admins',
  MEMBERS: '/admin/users/members',
  DRIVERS: '/admin/users/drivers',
  INVITATIONS: '/admin/users/invitations', // ✅ 추가
  DETAIL: (id: number | string) => `/admin/users/${id}`,
  EDIT: (id: number | string) => `/admin/users/${id}/edit`,
} as const;

export const USER_ROUTE_PATTERNS = {
  LIST: /^\/admin\/users$/,
  CREATE: /^\/admin\/users\/create$/,
  ADMINS: /^\/admin\/users\/admins$/,
  MEMBERS: /^\/admin\/users\/members$/,
  DRIVERS: /^\/admin\/users\/drivers$/,
  INVITATIONS: /^\/admin\/users\/invitations$/, // ✅ 추가
  EDIT: /^\/admin\/users\/(\d+)\/edit$/,
  DETAIL: /^\/admin\/users\/(\d+)$/,
} as const;
