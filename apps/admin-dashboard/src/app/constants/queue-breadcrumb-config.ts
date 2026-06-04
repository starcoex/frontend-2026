export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const QUEUE_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '대기열 관리',
    title: '대기열 관리',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: true,
  },
  CREATE: {
    label: '대기 수기 등록',
    title: '대기 수기 등록',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  STATS: {
    label: '대기열 통계',
    title: '대기열 통계',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_QUEUE_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '대기열 관리',
  title: '대기열 관리',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
