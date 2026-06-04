import type { BreadcrumbConfig } from './analytics-breadcrumb-config';

export const DASHBOARD_BREADCRUMB_CONFIGS = {
  ROOT: {
    label: '요약 분석',
    title: '요약 분석',
    showInBreadcrumb: false,
    showActions: false,
  },
} as const;

export const DEFAULT_DASHBOARD_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '요약 분석',
  title: '요약 분석',
  showInBreadcrumb: false,
  showActions: false,
};
