export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const PAYMENT_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '결제 관리',
    title: '결제 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  CREATE: {
    label: '결제 등록',
    title: '결제 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  STATS: {
    label: '결제 통계',
    title: '결제 통계',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_PAYMENT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '결제',
  title: '결제',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
