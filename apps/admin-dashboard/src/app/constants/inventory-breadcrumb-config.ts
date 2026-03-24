export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const INVENTORY_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '재고 관리',
    title: '재고 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  LOW_STOCK: {
    label: '재고 부족 현황',
    title: '재고 부족 현황',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  CREATE: {
    // ← 추가
    label: '재고 추가',
    title: '재고 추가',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  EDIT: {
    label: '재고 수정',
    title: '재고 수정',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_INVENTORY_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '재고 관리',
  title: '재고 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
