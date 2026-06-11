export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const APICK_BREADCRUMB_CONFIGS = {
  FLOOD: {
    label: '침수차 이력',
    title: '침수차 조회 이력',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: true,
  },
  SCRAP: {
    label: '폐차 이력',
    title: '폐차사고처리 이력',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: true,
  },
  SALE: {
    label: '매매 이력',
    title: '매매용 차량 이력',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: true,
  },
  SEARCH: {
    label: '통합 조회',
    title: 'Apick 통합 조회',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  STATS: {
    label: '통계',
    title: 'Apick 통계',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  ACCOUNT: {
    label: '계정 정보',
    title: 'Apick 계정 정보',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_APICK_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: 'Apick',
  title: 'Apick 차량 조회',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
