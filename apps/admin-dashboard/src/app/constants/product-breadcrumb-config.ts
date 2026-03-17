export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const PRODUCT_BREADCRUMB_CONFIGS = {
  LIST: {
    label: 'Products',
    title: 'Product Management',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: 'Create Product',
    title: 'Add New Product',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SCAN: {
    // ✅ 추가
    label: '바코드 스캔',
    title: '바코드 스캔',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false, // ← 전체 목록 통계 비표시
  },
} as const;

export const DEFAULT_PRODUCT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: 'Products',
  title: 'Products',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
