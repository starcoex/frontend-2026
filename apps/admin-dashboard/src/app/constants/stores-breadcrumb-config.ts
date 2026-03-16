export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const STORE_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '매장 목록',
    title: '매장 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '매장 추가',
    title: '새 매장 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  BRANDS: {
    label: '브랜드 목록',
    title: '브랜드 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: true,
  },
} as const;

export const DEFAULT_STORE_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '매장',
  title: '매장 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
