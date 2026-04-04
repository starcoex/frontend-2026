export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const PRODUCT_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '제품 목록',
    title: '제품 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '제품 추가',
    title: '새 제품 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SCAN: {
    label: '바코드 스캔',
    title: '바코드 스캔',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  INVENTORY: {
    label: '재고 현황',
    title: '재고 현황',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SETTINGS: {
    label: '제품 설정',
    title: '제품 설정',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_PRODUCT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '제품',
  title: '제품 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
