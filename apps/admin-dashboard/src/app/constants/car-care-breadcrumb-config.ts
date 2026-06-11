export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const CAR_CARE_BREADCRUMB_CONFIGS = {
  PRICES: {
    label: '세차 가격',
    title: '세차 가격 관리',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: false,
  },
  PRICES_CREATE: {
    label: '가격 추가',
    title: '세차 가격 추가',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  SURCHARGES: {
    label: '추가금 정책',
    title: '세차 추가금 정책',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: false,
  },
  SURCHARGES_CREATE: {
    label: '추가금 추가',
    title: '추가금 정책 추가',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_CAR_CARE_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '카케어 관리',
  title: '카케어 관리',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
