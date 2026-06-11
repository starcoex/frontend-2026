export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const VEHICLE_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '차량 관리',
    title: '차량 관리',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: true,
  },
  BRANDS: {
    label: '브랜드 관리',
    title: '브랜드 관리',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: false,
  },
  MODELS: {
    label: '차량 모델 관리',
    title: '차량 모델 관리',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: false,
  },
  DIMENSION_RULES: {
    label: '차체 치수 룰',
    title: '차체 치수 등급 룰',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: false,
  },
  PENDING_REVIEW: {
    label: '검토 대기',
    title: '검토 대기 차량',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  LOW_CONFIDENCE: {
    label: '낮은 신뢰도',
    title: '낮은 신뢰도 차량',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_VEHICLE_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '차량 관리',
  title: '차량 관리',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
