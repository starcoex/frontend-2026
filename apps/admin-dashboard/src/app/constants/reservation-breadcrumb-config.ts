export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const RESERVATION_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '예약 관리',
    title: '예약 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '예약 추가',
    title: '예약 추가',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  EDIT: {
    label: '예약 수정',
    title: '예약 수정',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SERVICES: {
    // ← 추가
    label: '서비스 설정',
    title: '서비스 설정',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  CALENDAR: {
    // ← 추가
    label: '예약 캘린더',
    title: '예약 캘린더',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_RESERVATION_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '예약 관리',
  title: '예약 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
