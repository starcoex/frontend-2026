export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const REVIEW_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '리뷰 목록',
    title: '리뷰 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '리뷰 추가',
    title: '새 리뷰 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SCOPES: {
    label: '리뷰 스코프 관리',
    title: '일반 리뷰 스코프 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_REVIEW_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '리뷰',
  title: '리뷰 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
