// ✅ 1. 전역 경로 상수 정의 (이것만 수정하면 모든 곳에 반영됨)
export const APP_ROUTES = {
  DASHBOARD: '/admin',
  PROFILE: '/admin/settings/profile',
  SETTINGS: '/admin/settings',
  NOTIFICATIONS: '/admin/settings/notifications',
  BILLING: '/admin/settings/billing',
  USERS: '/admin/users',
  SYSTEM: '/admin/settings', // 시스템 관리도 설정 페이지로 연결 (필요시 분리)
  SUGGESTIONS: '/admin/suggestions',
} as const;
