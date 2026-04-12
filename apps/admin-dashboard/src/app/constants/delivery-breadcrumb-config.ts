export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const DELIVERY_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '배송 목록',
    title: '배송 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '배송 추가',
    title: '새 배송 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  DRIVERS: {
    label: '배달기사 관리',
    title: '배달기사 관리',
    showInBreadcrumb: true,
    showActions: true, // ✅ true로 변경
    showStats: false,
  },
  DRIVERS_CREATE: {
    // ✅ 추가
    label: '기사 등록',
    title: '배달기사 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  TRACKING: {
    label: '배송 추적',
    title: '배송 추적',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_DELIVERY_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '배송',
  title: '배송 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
