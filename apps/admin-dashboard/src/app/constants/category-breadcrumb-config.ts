export interface CategoryBreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const CATEGORY_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '카테고리 목록',
    title: '전체 카테고리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  HIERARCHY: {
    label: '카테고리 계층',
    title: '카테고리 계층 구조',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_CATEGORY_BREADCRUMB_CONFIG: CategoryBreadcrumbConfig = {
  label: '카테고리',
  title: '카테고리 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
