import type { BreadcrumbConfig } from './analytics-breadcrumb-config';

export const OVERVIEW_BREADCRUMB_CONFIGS = {
  DASHBOARD: {
    label: '요약 분석',
    title: '요약 분석',
    showInBreadcrumb: false,
    showActions: false,
  },
} as const;

export const DEFAULT_OVERVIEW_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '요약 분석',
  title: '요약 분석',
  showInBreadcrumb: false,
  showActions: false,
};
