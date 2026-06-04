export const JOB_ROUTES = {
  LIST: '/admin/jobs',
  CREATE: '/admin/jobs/create',
  APPLICATIONS: '/admin/jobs/applications',
  DETAIL: '/admin/jobs/:id',
  EDIT: '/admin/jobs/:id/edit',
  POSTING_APPLICATIONS: '/admin/jobs/:id/applications',
} as const;

export const JOB_ROUTE_PATTERNS = {
  EDIT: /^\/admin\/jobs\/(\d+)\/edit$/,
  POSTING_APPLICATIONS: /^\/admin\/jobs\/(\d+)\/applications$/,
  APPLICATIONS: /^\/admin\/jobs\/applications$/,
  DETAIL: /^\/admin\/jobs\/(\d+)$/, // 숫자만 매칭 → 'applications' 문자열은 걸리지 않음
} as const;
