export const CONTACT_ROUTES = {
  LIST: '/admin/contacts',
  STATS: '/admin/contacts/stats',
  DETAIL: '/admin/contacts/:id',
} as const;

export const CONTACT_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/contacts\/([^/]+)$/,
} as const;
