export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
}

export const ANALYTICS_BREADCRUMB_CONFIGS = {
  OVERVIEW: {
    label: '시스템 분석',
    title: '시스템 분석',
    showInBreadcrumb: false,
    showActions: false,
  },
  REALTIME: {
    label: '실시간',
    title: '실시간 분석',
    showInBreadcrumb: true,
    showActions: false,
  },
  RANKING: {
    label: '랭킹',
    title: '랭킹',
    showInBreadcrumb: true,
    showActions: false,
  },
  SERVICE: {
    label: '서비스 분석',
    title: '서비스 분석',
    showInBreadcrumb: true,
    showActions: false,
  },
  ADMIN: {
    label: '어드민',
    title: '어드민 대시보드',
    showInBreadcrumb: true,
    showActions: false,
  },
} as const;

export const DEFAULT_ANALYTICS_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '시스템 분석',
  title: '시스템 분석',
  showInBreadcrumb: false,
  showActions: false,
};
