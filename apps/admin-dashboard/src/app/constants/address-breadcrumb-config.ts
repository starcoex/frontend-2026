export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const ADDRESS_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '주소 관리',
    title: '주소 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  CREATE: {
    label: '주소 검색 · 저장',
    title: '주소 검색 · 저장',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  STATS: {
    label: '주소 통계',
    title: '주소 통계',
    showInBreadcrumb: true,
    showActions: false,
    showStats: true,
  },
  LOGS: {
    label: '검색 로그',
    title: '검색 로그',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_ADDRESS_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '주소',
  title: '주소',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
