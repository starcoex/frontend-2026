import type { BreadcrumbConfig } from './analytics-breadcrumb-config';

export const SALES_BREADCRUMB_CONFIGS = {
  OVERVIEW: {
    label: '매출 현황',
    title: '매출 현황',
    showInBreadcrumb: false,
    showActions: true,
  },
} as const;

export const DEFAULT_SALES_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '매출 현황',
  title: '매출 현황',
  showInBreadcrumb: false,
  showActions: true,
};
