export const RESERVATION_ROUTES = {
  LIST: '/admin/reservations',
  CREATE: '/admin/reservations/create',
  SERVICES: '/admin/reservations/services', // ← 추가
  CALENDAR: '/admin/reservations/calendar', // ← 추가
  DETAIL: '/admin/reservations/:id',
  EDIT: '/admin/reservations/:id/edit',
} as const;

export const RESERVATION_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/reservations\/([^/]+)\/edit$/,
  DETAIL: /^\/admin\/reservations\/([^/]+)$/,
} as const;
