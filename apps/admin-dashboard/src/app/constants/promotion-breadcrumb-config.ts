export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
}

export const PROMOTION_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '프로모션 목록',
    title: '프로모션 관리',
    showInBreadcrumb: true,
  },
  CREATE: {
    label: '프로모션 생성',
    title: '프로모션 생성',
    showInBreadcrumb: true,
  },
} as const;

export const DEFAULT_PROMOTION_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '프로모션',
  title: '프로모션 관리',
  showInBreadcrumb: true,
};
